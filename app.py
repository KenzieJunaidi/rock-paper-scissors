import mediapipe as mp
import cv2
import numpy as np
import base64
import re

import flask
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Open Webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Webcam Failed!")
    exit()

# Setup Mediapipe (Modules)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

def count_fingers(hand_landmarks):
    ids = [4, 8, 12, 16, 20]
    fingers = []

    # Thumb
    if hand_landmarks.landmark[ids[0]].x < hand_landmarks.landmark[ids[0] - 1].x:
        fingers.append(1)
    else:
        fingers.append(0)

    # Rest of Fingers
    for i in range (1, 5):
        if hand_landmarks.landmark[ids[i]].y < hand_landmarks.landmark[ids[i] - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)

    return fingers

def detect_sign(fingers):
    if fingers == [0, 0, 0, 0, 0]:
        return "Rock"
    elif fingers == [0, 1, 1, 0, 0]:
        return "Scissors"
    elif fingers == [1, 1, 1, 1, 1]:
        return "Paper"
    else:
        return "Not Detected"

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/play')
def play():
    return render_template('play.html')

@app.route('/get-sign', methods=['POST'])
def get_sign():
    data = request.get_json()
    image_data = data['image']

    # Remove Header
    imgstr = re.search(r'base64,(.*)', image_data).group(1)
    img_bytes = base64.b64decode(imgstr)

    # Bytes → OpenCV Image
    arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # BGR → RGB (cv2 → MediaPipe)
    result = hands.process(rgb)

    if result.multi_hand_landmarks: # Hand Detected
        for idx, hand_landmarks in enumerate(result.multi_hand_landmarks):
            used_hand = result.multi_handedness[idx].classification[0].label  # Left / Right Hand?
        
        if used_hand == 'Left':
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) # BGR → RGB (cv2 → MediaPipe)
            result = hands.process(rgb)
        
        for hand_landmarks in result.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            finger_list = count_fingers(hand_landmarks)
            move = detect_sign(finger_list)
            return jsonify({'Gesture': move})
        
    return jsonify({'Gesture': 'No Hand Detected'})

if __name__ == '__main__':
    app.run(debug=True)