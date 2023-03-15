import { LightningElement, track } from "lwc";
/******************
 * 開始遊戲
 *  生成遊戲畫面 初始化蛇在0:0
 *  隨機生成食物
 *  設定速度speed=1;(分數越高速度越快)
 * (起始向右移動xSpeed=1,ySpeed=0)
 *  利用window.addEventListener去監聽上下左右改面方向
 *
 *
 *
 *
 */
export default class Snakes extends LightningElement {
  score = 0; //分數
  blockSize = 20; //每個方塊大小

  @track gameBlocks = []; //遊戲區愈

  isRenderComplete = false; //判斷是否render完成
  speed = 1; //速度
  xSpeed = 1;
  ySpeed = 0;
  xHead = 0; //蛇的位置
  yHead = 0; //蛇的位置
  xMax; //遊戲區域的x軸最大值
  yMax; //遊戲需育的y軸最大值
  isGameStart = false; //避免無線迴圈去call renderedCallback
  interval; //時間間隔(設定速度用)
  tail = []; //設定蛇的尾巴
  //監聽案件事件
  keyControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowUp":
          this.xSpeed = 0;
          this.ySpeed = -1;
          break;
        case "ArrowLeft":
          this.xSpeed = -1;
          this.ySpeed = 0;
          break;
        case "ArrowDown":
          this.xSpeed = 0;
          this.ySpeed = 1;
          break;
        case "ArrowRight":
          this.xSpeed = 1;
          this.ySpeed = 0;
          break;
        default:
          break;
      }
    });
  }

  addSpeed() {
    this.speed = this.speed + 0.1;
    clearInterval(this.interval);
    this.startGame();
  }

  generateFood() {
    let i = 0;
    i++;
    const xFood = Math.floor(Math.random() * (this.xMax - 1));
    const yFood = Math.floor(Math.random() * (this.yMax - 1));
    // console.log(xFood, yFood);
    const foodPosIndex = this.gameBlocks.findIndex(
      (x) => x.id === `${xFood}:${yFood}`
    );
    if (this.gameBlocks[foodPosIndex].snake) {
      this.generateFood();
    } else {
      this.gameBlocks[foodPosIndex].food = true;
      this.gameBlocks[foodPosIndex].class = "food";
    }

    console.log(i);
  }

  iniGame() {
    this.isGameStart=false;
    this.isRenderComplete=false;
    this.speed = 1; //速度
    this.xSpeed = 1;
    this.ySpeed = 0;
    this.xHead = 0; //蛇的位置
    this.yHead = 0; //蛇的位置
    this.score=0;
    clearInterval(this.interval);
    this.tail=[];
    this.gameBlocks.clear();
    this.renderedCallback();

  }

  startGame() {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.isGameStart=true;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.interval = setInterval(() => {
      this.move();
    }, 300 / this.speed);
  }

  move() {
    if (this.isGameStart) {
      const lastElement = this.tail[this.tail.length - 1];
      if (lastElement !== `${this.xHead}:${this.yHead}`) {
        this.tail.push(`${this.xHead}:${this.yHead}`);
        const removedElement = this.tail.shift();
        const curPosIndex = this.gameBlocks.findIndex(
          (x) => x.id === removedElement
        );
        this.gameBlocks[curPosIndex].snake = false;
        this.gameBlocks[curPosIndex].class = "";
      }

      this.xHead += this.xSpeed;
      this.yHead += this.ySpeed;

      if (this.xHead >= this.xMax) {
        this.xHead = 0;
      }

      if (this.xHead < 0) {
        this.xHead = this.xMax - 1;
      }

      if (this.yHead >= this.yMax) {
        this.yHead = 0;
      }

      if (this.yHead < 0) {
        this.yHead = this.yMax - 1;
      }
      if (this.tail.includes(`${this.xHead}:${this.yHead}`)) {
        this.isRenderComplete = true;
        this.iniGame();
      }

      const newPosition = this.gameBlocks.findIndex(
        (x) => x.id === `${this.xHead}:${this.yHead}`
      );
      this.gameBlocks[newPosition].snake = true;
      this.gameBlocks[newPosition].class = "snake";
      if (this.gameBlocks[newPosition].food) {
        this.gameBlocks[newPosition].food = false;
        this.generateFood();
        this.score++;
        this.addSpeed();
        this.tail.push(`${this.xHead}:${this.yHead}`);
        console.log(this.tail);
      }
    }
  }

  //遊戲開始及初始化
  renderedCallback() {
    if (!this.isRenderComplete) {
      this.isRenderComplete = true;
      let eHeight = this.template.querySelector(".game-container").clientHeight;

      let eWidth = this.template.querySelector(".game-container").clientWidth;

      this.xMax = Math.ceil(eWidth / this.blockSize);
      this.yMax = Math.ceil(eHeight / this.blockSize);

      let tmpBlocks = [];

      for (let y = 0; y < this.yMax; y++) {
        for (let x = 0; x < this.xMax; x++) {
          let obj;
          if (x === 0 && y === 0) {
            obj = {
              id: `${x}:${y}`,
              food: false,
              snake: true,
              class: "snake"
            };
          } else {
            obj = {
              id: `${x}:${y}`,
              food: false,
              snake: false,
              class: ""
            };
          }
          tmpBlocks.push(obj);
        }
      }
      this.gameBlocks = tmpBlocks;
      this.generateFood();
      this.keyControls();
      // this.startGame();
    }
  }
}
