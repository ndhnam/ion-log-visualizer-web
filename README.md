# ion-log-visualizer-web

A web-based tool for visualizing ION log files.  
Built with **React** and **modern web technologies**, this project enables interactive viewing, searching, 3D visualization, and analysis of robot log data entirely in the browser.

---

## Features

- Upload and parse `.ion` log files
- 3D visualization of robot movement
- Real-time log playback
- ROS console output viewer
- Image stream visualization
- Topic data inspection
- Time-based navigation through logs
- Bot model visualization
- Session metadata display
- Robot configuration inspection

---

## Requirements

### Backend

```bash
# Create backend folder and install dependencies
mkdir backend
cd backend
npm init -y
npm install express ion-js multer cors jpeg-js
```

If you need image decoding on Python side:
```bash
# Install Python server dependencies
pip3 install opencv-python numpy flask
```

---

## Usage

### 1. Start the backend server
```bash
cd backend
node index.js
```
(Backend listens by default on [http://localhost:5000](http://localhost:5000))

### 2. Start the Python image decoder server (optional, for advanced image topics)
```bash
cd backend/python_server
python3 main.py
```
(Default Flask server at [http://localhost:5001](http://localhost:5001))

### 3. Start the frontend (React Vite app)
```bash
cd frontend
npm install
npm run dev
```
(Frontend runs on [http://localhost:5173](http://localhost:5173) by default.)

---

## Project Structure

```
backend/
  ├── index.js          # Node.js server: upload, parse ION log, decompress models
  └── python_server/    # Python server (optional): decode compressed images
frontend/
  └── src/              # React + Vite application
      ├── components/   # Dropzone, Viewport3D, KeyValueTable, etc.
      ├── utils/        # Helper functions (e.g., FormatTime)
      └── App.jsx       # Main application logic
```

---

## Notes

- OBJ robot model extraction from metadata is handled on backend (`ion-js` + `jpeg-js` + `zlib`).
- 3D viewer uses **three.js** with **@react-three/fiber** and **@react-three/drei**.
- Supports visualization of robot pose trajectory based on `/tb_control/wheel_odom` topic.
- Supports grid, axes, orbit camera controls for better scene navigation.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Credits

- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [ION JS](https://github.com/amzn/ion-js)

---

