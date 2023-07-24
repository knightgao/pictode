import { fabric } from 'fabric';

import { Ellipse } from '../customs/ellipse';
import { AppMouseEvent, ToolStrategy } from '../types';

import { selectTool } from './select-tool';

class EllipseTool implements ToolStrategy {
  private startPointer: fabric.Point = new fabric.Point(0, 0);
  private ellipse: Ellipse | null = null;
  private targets: fabric.Object[] = [];

  public onMouseDown({ app, event }: AppMouseEvent): void {
    if (event.target) {
      this.targets.push(event.target);
    }
    app.canvas.selection = false;
    this.startPointer = app.pointer;
    this.ellipse = new Ellipse({
      left: this.startPointer.x,
      top: this.startPointer.y,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
    });
    app.canvas.add(this.ellipse);
  }

  public onMouseMove({ app, event }: AppMouseEvent): void {
    if (event.target) {
      this.targets.push(event.target);
      event.target.set({
        evented: false,
      });
    }

    app.render();
    if (!this.ellipse) {
      return;
    }

    // 计算起点和当前鼠标位置之间的距离
    const dx = app.pointer.x - this.startPointer.x;
    const dy = app.pointer.y - this.startPointer.y;

    // 计算椭圆的宽度和高度的绝对值
    const radiusX = Math.abs(dx) / 2;
    const radiusY = Math.abs(dy) / 2;

    // 根据起点和鼠标位置计算椭圆的中心位置
    const centerX = this.startPointer.x + dx / 2;
    const centerY = this.startPointer.y + dy / 2;

    this.ellipse.set({ rx: radiusX, ry: radiusY, left: centerX - radiusX, top: centerY - radiusY });
    app.render();
  }

  public onMouseUp({ app }: AppMouseEvent): void {
    this.targets.forEach((obj) => {
      obj.set({
        evented: true,
      });
    });
    app.setTool(selectTool);
    this.startPointer.setXY(0, 0);
    this.ellipse && app.canvas.setActiveObject(this.ellipse);
    this.ellipse = null;
    app.render(true);
  }
}

export const ellipseTool = new EllipseTool();

export default ellipseTool;
