export class ImageBuffer{
  private _buffer: number[] = []
  private height = 16
  private width = 16
  constructor(){
    //Create Transparent Buffer
    for(let i = 0; i < 256; i++){
      this._buffer.push(-1)
    }
  }
  setPixel(x: number, y:number, color:number){
    this._buffer[y * this.width + x] = color
  }
  getPixel(x: number, y:number): number{
    return this._buffer[y * this.width + x]
  }
  get buffer(): number[]{
    return this.buffer
  }
}
