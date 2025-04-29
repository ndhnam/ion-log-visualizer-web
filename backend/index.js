const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const ion = require("ion-js");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const zlib = require("zlib");

function extractObjFromBotModel(base64GzStr) {
  const gzBuffer = Buffer.from(base64GzStr, "base64");
  const objBuffer = zlib.gunzipSync(gzBuffer); // Buffer OBJ
  return objBuffer.toString(); // OBJ chain
}

// Route upload file ION
app.post("/upload-ion", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Read binary ION file
    const ionData = fs.readFileSync(filePath);

    // Parse ION to object
    const reader = ion.makeReader(ionData);
    const struct = ion.load(reader);

    // Delete temporary file
    fs.unlinkSync(filePath);

    // Get metadata and topics
    const metadata = struct.metadata || null;

    const topics = struct.topics || null;

    const promises = [];
    let jpegArrayString = "";

    for (const topic of topics) {
      if (
        String(topic.topicType) === "sensor_msgs/CompressedImage" ||
        String(topic.topic_type) === "sensor_msgs/CompressedImage"
      ) {
        for (const msg of topic.messages || []) {
          if (msg.data && msg.data.data) {
            jpegArrayString = String(msg.data.data);
            delete msg.data.data;
            msg.data.data_base64 = "";
            // Data parse from ION log
            const fetchPromise = fetch("http://localhost:5001/decode-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jpeg_data: jpegArrayString }),
            })
              .then((res) => res.json())
              .then((data) => {
                msg.data.data_base64 = data.image_base64;
              })
              .catch((err) => console.error(err));

            promises.push(fetchPromise);
          }
        }
      }
    }

    // Dùng fetch() bên trong vòng for, nhưng fetch là bất đồng bộ (async).
    // Tuy nhiên res.json(data) lại được gọi ngay sau vòng lặp mà
    // không chờ các fetch hoàn thành
    // → kết quả trả về không có data_base64 hoặc dữ liệu bị thiếu.
    // Chờ tất cả decode xong
    await Promise.all(promises);

    // Get obj file
    const objString = extractObjFromBotModel(metadata.botModel.data);
    // fs.writeFileSync(String(metadata.botModel.filename), objString, "utf8");

    const data = {
      metadata: metadata,
      topics: topics,
      objString: objString,
      success: true,
    };
    // Return parsed data
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
