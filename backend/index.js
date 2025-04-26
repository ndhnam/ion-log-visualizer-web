const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const ion = require('ion-js');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Route upload file ION
app.post('/upload-ion', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    try {
        // Read binary ION file
        const ionData = fs.readFileSync(filePath);

        // Parse ION thành object
        const reader = ion.makeReader(ionData);
        const struct = ion.load(reader);

        // Delete temporary file
        fs.unlinkSync(filePath);

        // Log session info
        console.log('Session info:', struct.metadata.compressionMethod);

        // Get metadata and botInfo
        const metadata = struct.metadata || null;
        const botInfo = metadata?.botInfo || null;

        const data = {
            data : {
                botInfo: botInfo,
            },
            success: true,
        }
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
