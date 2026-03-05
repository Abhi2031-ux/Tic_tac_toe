let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('#reset-btn');
let show_winner_box = document.querySelector('.show_winner_box');
let win = document.querySelector('.win');
let you = document.querySelector('.you');
let bot = document.querySelector('.bot');
let retry = document.querySelector('.retry');
let game_boad = document.querySelector('.game_boad');
let coin = document.querySelector('.coin');
let shop = document.querySelector('.shop');
let boad = document.querySelector('.boad');
let background = document.querySelector('.background');
let mode = document.querySelector('.mode');
let close_shop_box = document.querySelector('.close_shop_box');
let shop_main_box = document.querySelector('.shop_main_box');
let main_shoping = document.querySelector('.main_shoping');
let lock_price = document.querySelectorAll('.lock_price');
let BG_shoping_section = document.querySelector('.BG_shoping_section');
let mode_shoping_section = document.querySelector('.mode_shoping_section');
let none = document.querySelector('.none');
let msg = document.querySelector('.msg');

music.play();

let turnO = true;
let gameActive = true;
let your_score = 1;
let box_score = 1;


function only_closer(c1, c2, c3, c4, c5) {
    c1.style.display = 'none';
    c2.style.display = 'none';
    c3.style.display = 'none';
    c4.style.display = 'none';
    c5.style.display = 'none';

}



only_closer(show_winner_box, shop_main_box, msg, BG_shoping_section, mode_shoping_section);

// Todo: In-memory coin balance
let coinsBalance = 500
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const resetGame = () => {
    turnO = true;
    gameActive = true;
    enableBoxes();
}

const makeComputerMove = () => {
    if (!gameActive) return;

    let computerMove = findWinningMove('X');

    if (computerMove === -1) {
        computerMove = findWinningMove('O');
    }

    if (computerMove === -1 && !boxes[4].innerText) {
        computerMove = 4;
    }

    if (computerMove === -1) {
        let emptyBoxes = Array.from(boxes).map((box, index) =>
            box.innerText === "" ? index : -1).filter(index => index !== -1);
        if (emptyBoxes.length > 0) {
            computerMove = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        }
    }

    if (computerMove !== -1) {
        setTimeout(() => {
            boxes[computerMove].innerText = "X";
            boxes[computerMove].disabled = true;
            turnO = true;
            checkWinner();
        }, 500);
    }
};

const findWinningMove = (player) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

        if (values.filter(val => val === player).length === 2 &&
            values.filter(val => val === "").length === 1) {
            let emptyIndex = values.indexOf("");
            return pattern[emptyIndex];
        }
    }
    return -1;
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!gameActive || !turnO || box.innerText !== "") return;

        box.innerText = "O";
        box.disabled = true;
        turnO = false;

        if (checkWinner()) return;

        sound.play();
        makeComputerMove();
    });
});

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

function getCoins() {
    return coinsBalance;
}

function price(lockElement) {
    if (!lockElement) return 100;
    const dataCost = Number(lockElement.dataset && lockElement.dataset.cost);
    if (!Number.isNaN(dataCost) && dataCost > 0) return dataCost;

    // Try to parse number from the element's text (e.g. "Unlock 300")
    const text = (lockElement.innerText || "").replace(/[^0-9]/g, "");
    const parsed = Number(text);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;

    return 100;
}

function createLock(id, checkboxId, cost, target, createCheckbox = true, pricePosition = 'down') {
    if (!target) return null;

    // Ensure the container itself carries the cost so existing code (price()) can read it
    try { target.dataset.cost = String(cost); } catch (e) { /* ignore */ }

    let input = null;
    if (createCheckbox) {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.id = checkboxId;
        input.dataset.cost = String(cost);
        input.className = 'lock-checkbox';
        target.appendChild(input);
    }

    const label = document.createElement('label');
    if (createCheckbox) label.htmlFor = checkboxId;
    label.className = 'lock-label';
    label.id = id;

    const spanWrapper = document.createElement('span');
    spanWrapper.className = 'lock-wrapper';

    const shackle = document.createElement('span');
    shackle.className = 'shackle';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'lock-body');
    svg.setAttribute('viewBox', '0 0 28 28');
    svg.setAttribute('fill', 'none');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('clip-rule', 'evenodd');
    path.setAttribute('d', 'M0 5C0 2.23858 2.23858 0 5 0H23C25.7614 0 28 2.23858 28 5V23C28 25.7614 25.7614 28 23 28H5C2.23858 28 0 25.7614 0 23V5ZM16 13.2361C16.6137 12.6868 17 11.8885 17 11C17 9.34315 15.6569 8 14 8C12.3431 8 11 9.34315 11 11C11 11.8885 11.3863 12.6868 12 13.2361V18C12 19.1046 12.8954 20 14 20C15.1046 20 16 19.1046 16 18V13.2361Z');
    path.setAttribute('fill', 'white');

    svg.appendChild(path);
    spanWrapper.appendChild(shackle);
    spanWrapper.appendChild(svg);
    label.appendChild(spanWrapper);

    target.appendChild(label);

    // Add a visible price tag inside the target. Position can be 'up' or 'down'.
    try {
        const priceTag = document.createElement('div');
        // Add the additional class 'second_prece_tag' for special BG price tags
        priceTag.className = 'price_tag price_tag--' + (pricePosition === 'up' ? 'up' : 'down') + ' second_prece_tag';
        priceTag.innerText = String(cost);
        target.appendChild(priceTag);
    } catch (e) { /* ignore */ }

    return { input, label };
}

function addCoin(amount) {
    coinsBalance += amount;
    coin.innerText = coinsBalance;
}

function subCoin(amount) {
    coinsBalance -= amount;
    coin.innerText = coinsBalance;
}

function checkBalance() {
    console.log("Current coins: " + coinsBalance);
    return coinsBalance;
}

const showWinner = (winner) => {

    show_winner_box.style.display = "grid";

    if (winner === 'X') {
        win.innerText = "You Loss";
        bot.innerText = box_score++;

    } else if (winner === 'O') {
        win.innerText = "You Win";
        you.innerText = your_score++;
        addCoin(500);

    }

    disableBoxes();
};


const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("winner", pos1Val);
                showWinner(pos1Val);
                gameActive = false;
                return true;
            }
        }
    }

    // Todo: Check for draw
    if (Array.from(boxes).every(box => box.innerText !== "")) {
        show_winner_box.style.display = "grid";
        win.innerText = "Game Draw!";
        disableBoxes();
        gameActive = false;
        return true;
    }

    return false;
};


function closer(closer_name, click_to_close, new_box, flow_it) {
    click_to_close.addEventListener('click', () => {
        closer_name.style.display = "none";
        new_box.style.display = "flex";
        flow_it.style.display = "block";
    });
}

document.addEventListener('DOMContentLoaded', () => {

    if (lock_price && lock_price.length) {
        const ids = ['first_boad_img', 'second_boad_img', 'therd_boad_img', 'fourth_boad_img', 'fivth_boad_img', 'sixth_boad_img', 'seventh_boad_img', 'eighth_boad_img', 'nineth_boad_img', 'ten_boad_img'];
        const costs = [100, 300, 500, 1000, 1500, 2500, 3000, 5000, 7000, 10000];
        lock_price.forEach((el, idx) => {
            const id = ids[idx] || ('lock_boad_' + idx);
            const cost = costs[idx] || 100;
            createLock(id, 'lock_cb_' + idx, cost, el, false, 'up');
        });

        first = document.querySelector('#first_boad_img');
        second = document.querySelector('#second_boad_img');
        third = document.querySelector('#therd_boad_img');
        forth = document.querySelector('#fourth_boad_img');
        fivth = document.querySelector('#fivth_boad_img');
        sixth = document.querySelector('#sixth_boad_img');
        sevth = document.querySelector('#seventh_boad_img');
        eight = document.querySelector('#eighth_boad_img');
        ninth = document.querySelector('#nineth_boad_img');
        tenth = document.querySelector('#ten_boad_img');
    }

    let lockLabels = document.querySelectorAll('.lock-label');

    // Attach click handler so clicking a lock-label attempts to unlock/purchase it
    lockLabels.forEach(lbl => {
        lbl.addEventListener('click', (e) => {
            const container = lbl.parentElement || lbl;
            const costVal = price(container);
            const balance = (typeof checkBalance === 'function') ? checkBalance() : getCoins();

            // If already unlocked, just hide the container
            if (lbl.classList.contains('unlocked')) {
                try { container.style.display = 'none'; } catch (e) { /* ignore */ }
                return;
            }

            // Lock is not yet unlocked - do purchase flow
            if (balance < costVal) {
                if (msg) {
                    msg.style.display = 'flex';
                    setTimeout(() => { try { msg.style.display = 'none'; } catch (e) { /* ignore */ } }, 1000);
                }
                return;
            }

            subCoin(costVal);

            // Hide only this clicked lock container
            try { container.style.display = 'none'; } catch (e) { /* ignore */ }

            try { lbl.classList.add('unlocked'); } catch (e) { /* ignore */ }
        });
    });

});


closer(show_winner_box, shop, none, shop_main_box);
closer(BG_shoping_section, boad, main_shoping, none);
closer(mode_shoping_section, boad, main_shoping, none);
closer(main_shoping, background, none, BG_shoping_section);
closer(mode_shoping_section, background, none, BG_shoping_section);
closer(BG_shoping_section, mode, mode_shoping_section, none);
closer(main_shoping, mode, mode_shoping_section, none);
closer(shop_main_box, close_shop_box, none, none);


retry.addEventListener('click', () => {
    show_winner_box.style.display = "none";
    resetGame();
})

resetBtn.addEventListener("click", resetGame);
main_shoping.style.display = "flex";


// Todo: BG Section

let bg_changed_0 = document.querySelector('#bg_changed_0');
let bg_changed_1 = document.querySelector('#bg_changed_1');
let bg_changed_2 = document.querySelector('#bg_changed_2');
let bg_changed_3 = document.querySelector('#bg_changed_3');
let bg_changed_4 = document.querySelector('#bg_changed_4');
let bg_changed_5 = document.querySelector('#bg_changed_5');
let bg_changed_6 = document.querySelector('#bg_changed_6');
let bg_changed_7 = document.querySelector('#bg_changed_7');
let bg_changed_8 = document.querySelector('#bg_changed_8');
let bg_changed_9 = document.querySelector('#bg_changed_9');
let bg_changed_10 = document.querySelector('#bg_changed_10');


function bg_changed(name, URL, price) {

    // Guard against missing element
    if (!name) return;

    name.addEventListener('click', () => {
        const balance = (typeof checkBalance === 'function') ? checkBalance() : getCoins();

        // If already unlocked (has unlocked class or parent has it), just change background
        const container = name.parentElement || name;
        if (name.classList.contains('unlocked') || container.classList.contains('unlocked')) {
            document.body.style.backgroundImage = "url('" + URL + "')";
            return;
        }

        // BG lock is not yet unlocked - do purchase flow
        if (balance < price) {
            if (msg) {
                msg.style.display = "flex";
                setTimeout(() => { try { msg.style.display = 'none'; } catch (e) { /* ignore */ } }, 1000);
            }
            return;
        }

        document.body.style.backgroundImage = "url('" + URL + "')";

        // Hide only this clicked BG lock container
        try { container.style.display = 'none'; } catch (e) { /* ignore */ }

        // Mark as unlocked for future clicks
        try { name.classList.add('unlocked'); } catch (e) { /* ignore */ }

        subCoin(price);
    });
}

bg_changed(bg_changed_0, "images/BG_0_img.jpg", 0);
bg_changed(bg_changed_1, "images/BG_1_Z.png", 100);
bg_changed(bg_changed_2, "images/BG_2_Ghost.png", 300);
bg_changed(bg_changed_3, "images/BG_3_Dark.png", 500);
bg_changed(bg_changed_4, "images/BG_4_Horror_boby.png", 1000);
bg_changed(bg_changed_5, "images/BG_5_Room.png", 1500);
bg_changed(bg_changed_6, "images/BG_6_Dising.png", 2500);
bg_changed(bg_changed_7, "images/BG_7_Dark_baby.png", 3000);
bg_changed(bg_changed_8, "images/BG_8_Night_village.png", 5000);
bg_changed(bg_changed_9, "images/BG_9_Anime.jpg", 7000);
bg_changed(bg_changed_10, "images/BG_10_Sky.jpg", 10000);
