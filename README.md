# Jankenpon: Real-Time Rock-Paper-Scissors Detection Game

This repository contains code and files for my project titled:  
**"Rock-Paper-Scissors Powered by AI Hand Gesture Detection."**

The project uses computer vision and AI to detect hand gestures via webcam and classify them into rock, paper, or scissors. It then faces your move against a randomly generated move from the computer in real time.

**🎯 Objective**

To build a simple yet fun AI-powered game that demonstrates real-time hand gesture recognition using computer vision.

## 📁  Contents

- `main.py` – Flask backend serving the camera feed and gesture recognition
- `static/` – Frontend assets (CSS/JS)
- `media_pipe_model.py` – Hand tracking and gesture detection logic using MediaPipe
- `templates/` – Flask HTML templates
- `README.md` – Project documentation

## 💼 Tech Stack

- **Python**
- **Flask** (for web interface)
- **MediaPipe Hands** (for real-time hand tracking)
- **JavaScript & HTML/CSS** (for front-end interaction)

## 🚀 How Does It Work?

1. The webcam captures live video.
2. MediaPipe detects and tracks your hand.
3. A custom rule-based model interprets the gesture as rock, paper, or scissors.
4. The computer randomly selects a move.
5. The winner is calculated and displayed instantly.
