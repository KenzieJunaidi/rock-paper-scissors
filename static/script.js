const links = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname;

links.forEach(link => {
if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
}
});

// Game Mechanism
let yourMove = "";
let AIMove = "";
let Streak = 0;

function RandomizeMove() {
    const moves = ["Rock", "Paper", "Scissors"]
    AIMove = moves[Math.floor(Math.random() * 3)]
    Fight();
    return;
}

function ShowMove() {
    const hideBox1 = document.getElementById("reveal-move-border-1");
    const hideBox2 = document.getElementById("reveal-move-border-2");

    hideBox1.style.display = 'block'; // Show
    hideBox2.style.display = 'block';

    setTimeout(() => {
        hideBox1.style.display = 'none';
        hideBox2.style.display = 'none';
    }, 3000); // Hide it again after 3s
}

function LoadMove() {
    let flag = 0;
    const myImage = document.getElementById("dynamic-image-1");
    const AIImage = document.getElementById("dynamic-image-2");
    
    const myText = document.getElementById("dynamic-text-1");
    const AIText = document.getElementById("dynamic-text-2");

    // Dynamic Assets - Your Move
    if (yourMove === "Rock") myImage.src = `/static/assets/rock.png`;
    else if (yourMove === "Paper") myImage.src = `/static/assets/paper.png`;
    else if (yourMove === "Scissors") myImage.src = `/static/assets/scissors.png`;
    else flag = 1;

    myText.innerText = `Your Move: ${yourMove}`;

    // Dynamic Assets - AI Move
    if (AIMove === "Rock") AIImage.src = `/static/assets/rock.png`;
    else if (AIMove === "Paper") AIImage.src = `/static/assets/paper.png`;
    else AIImage.src = `/static/assets/scissors.png`;

    AIText.innerText = `AI's Move: ${AIMove}`;

    if (flag === 0) ShowMove();
}

function Fight() {
    let valid = "";
    console.log("Ally:", yourMove); // TEST FEATURE!
    console.log("Enemy:", AIMove); // TEST FEATURE!

    LoadMove();

    // Case A: Error
    if (yourMove === "No Hand Detected" || yourMove === "Not Detected" || yourMove === "Unknown") valid = "Draw";

    // Case B: Draw
    else if (yourMove === AIMove) valid = "Draw";

    // Case C: User Wins
    else if (
        (yourMove === "Rock" && AIMove === "Scissors") ||
        (yourMove === "Scissors" && AIMove === "Paper") ||
        (yourMove === "Paper" && AIMove === "Rock")
    )   valid = "Win";

    // Case D: User Loses
    else valid = "Lose";

    UpdateScore(valid);
    return;
}

function UpdateScore(valid) {
    if (valid === "Win") Streak = Streak + 1;
    else if (valid === "Lose") Streak = 0;

    const Score = document.getElementById("score-text");
    Score.innerText = `Win Streak: ${Streak}`;
    return;
}

const video = document.getElementById("webcam");
const canvas = document.createElement("canvas");

navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream;
        video.play()
    })
    .catch(error => {
        console.error("Failed to Access Webcam!");
    });

document.getElementById("detect-button").addEventListener("click", () => {
    // Countdown
    yourMove = "";
    const timerElement = document.getElementById("timer");
    let countdown = 3;

    timerElement.innerText = `Timer: ${countdown}s`;

    const countInterval = setInterval(() => {
        countdown = countdown - 1;
        
        // Counting Down
        if (countdown > 0) {
            timerElement.innerText = `Timer: ${countdown}s`;
        }

        // Capturing
        else{
            clearInterval(countInterval);
            timerElement.innerText = 'Timer: DONE!';

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL("image/jpeg");

            fetch("/get-sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData})
            })
            .then(response => response.json())
            .then(data => {
                yourMove = data.Gesture;
                RandomizeMove();
            })
            .catch(error => {
                yourMove = "Unknown";
            })
        }
    }, 1000) // 1s Interval
})