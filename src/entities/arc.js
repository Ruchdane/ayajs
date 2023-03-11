import { _uuid } from "./uuid";
import { _Register } from "../register";
import { Shape } from "../abstraction/shape";


/**
 * @class Arc
 */
class Arc extends Shape {
    /**
     * 
     * @param {string} uuid 
     */
    constructor(uuid, x0 = 0, y0 = 0, x = 100, y = 100, angle = 90, ratio = 1/2, svg, event, config){

        super();

        this.uuid = uuid;

        this.x0 = x0;
        this.y0= y0;

        this.x = x;
        this.y= y;

        this.angle = angle;

        this.offsetX0 = 0;
        this.offsetY0 = 0;

        this.offsetX = 0;
        this.offsetY = 0;


        this.dest_x = Math.round ((this.x0 + this.offsetX0) + ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.cos ((this.angle * Math.PI )/ 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.sin ((this.angle * Math.PI) / 180));
        this.dest_y = Math.round ((this.y0 + this.offsetY0) - ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.sin ((this.angle * Math.PI) / 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.cos ((this.angle * Math.PI) / 180));

        this.events = {};

        this.nativeEvent = event;

        this.config = config;

        this.c_svg = "";
        this.svg = svg;

        this.type = "arc";

        this.scaleX = 1;
        this.scaleY = 1;

        this.radius = Math.sqrt (((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * ((this.x + this.offsetX) - (this.x0  + this.offsetX0)) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * ((this.y + this.offsetY) - (this.y0 + this.offsetY0)));
        this.ratio = ratio;

        this.children = [];

        this.vertex = [];
        this.c_points = [];
    }

    addEvent(event, callback){
        this.c_svg.addEventListener(event, callback);
        this.events[event] = callback;
    }
    
    deleteEvent(event){
        var callback = this.events[event];
        this.c_svg.removeEventListener(event, callback);
        delete this.events[event];
    }

    deleteAllEvents(){
        Object.keys(this.events).map((event) => {
            this.deleteEvent(event);
        });
    }
    
    drawVertex(){
        if(this.vertex.length == 0)
            return;
    }

    drawConnector(){
        if(this.c_points.length == 0)
            return;
    }

    setStyles(o){
        if (o.fill)
          this.c_svg.setAttribute("fill", o.fill);
        if (o.stroke)
          this.c_svg.setAttribute("stroke", o.stroke);
        if (o.strokewidth)
          this.c_svg.setAttribute("stroke-width", o.strokewidth);
        if (o.fillopacity)
          this.c_svg.setAttribute("fill-opacity", o.fillopacity);
        if (o.strokeopacity)
          this.c_svg.setAttribute("stroke-opacity", o.strokeopacity);
          if (o.strokedasharray)
          this.c_svg.setAttribute("stroke-dasharray", o.strokedasharray);
        if (o.strokedashoffset)
          this.c_svg.setAttribute("stroke-dashoffset", o.strokedashoffset);
    }


    draw(){
        const ns = "http://www.w3.org/2000/svg";
        this.c_svg = document.createElementNS(ns,'path');

        this.dest_x = Math.round ((this.x0 + this.offsetX0) + ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.cos ((this.angle * Math.PI )/ 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.sin ((this.angle * Math.PI) / 180));
        this.dest_y = Math.round ((this.y0 + this.offsetY0) - ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.sin ((this.angle * Math.PI) / 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.cos ((this.angle * Math.PI) / 180));

        this.p = "M" + ( this.x0 == this.x ? this.x0 : 
              ( ( this.x0 + this.ratio * (this.x - this.x0) ) ) ) + " " + 
        ( this.x0 == this.x ? this.y0 + this.ratio * (this.y - this.y0) : ( (this.y - this.y0) / (this.x - this.x0) ) *  ( ( this.x0 + this.ratio * (this.x - this.x0) )  ) + (this.y0 - (( (this.y - this.y0) / (this.x - this.x0) ) * this.x0))) + " " +
        " L" + this.x + " " + this.y + " A " + this.radius + " " + this.radius + " 0 " + (this.angle > 180 ? 1 : 0) + " 0 " + 
        this.dest_x + " " + this.dest_y  + " L " +  
        ( this.dest_x - (1 - this.ratio) *(this.dest_x - this.x0) ) + " " +
         (((this.dest_y - this.y0)/(this.dest_x - this.x0)) * ( this.dest_x - (1 - this.ratio) *(this.dest_x - this.x0) ) + (this.y0 - ((this.dest_y - this.y0)/(this.dest_x - this.x0)) * this.x0)) ;

        // this.p = "M" + (this.x0 + this.ratio * this.radius) + " " + (this.y0 + this.ratio * this.radius) + " " +  " L" + this.x + " " + this.y + " A " + this.radius + " " + this.radius + " 0 " + (this.angle > 180 ? 1 : 0) + " 0 " + this.dest_x + " " + this.dest_y  + " L " +  (this.x0 + this.ratio * this.radius) + " " + (this.y0 + this.ratio * this.radius) ;
        this.c_svg.setAttribute("id", this.uuid);
        this.c_svg.setAttribute("fill", this.config.arc.fill);
        this.c_svg.setAttribute("stroke", this.config.arc.stroke);
        this.c_svg.setAttributeNS(null, "stroke-width", this.config.arc.strokeWidth);
        this.c_svg.setAttribute("d", this.p);

        this.svg.appendChild(this.c_svg);

        this.addEvent("mouseover", () =>{
            this.c_svg.setAttribute("class", "move");
        });
    }

    removeChildren(){
        this.children.map(({child}) => {
            child.removeFromDOM();
        });
    }

    removeFromDOM(){
        this.c_points.map((pt) => {
            pt.removeFromDOM();
        });
        this.vertex.map((vt) => {
            vt.removeFromDOM();
        });
        this.children.map(({child}) => {
            child.removeFromDOM();
        });
        this.svg.removeChild(this.c_svg);
    }

    shift(dx,dy){
        this.x0 += dx;
        this.y0 += dy;

        this.x += dx;
        this.y += dy;

        this.children.map(({child}) => {
            child.shift(dx, dy);
        });   
    }


    redraw(){
        this.dest_x = Math.round ((this.x0 + this.offsetX0) + ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.cos ((this.angle * Math.PI )/ 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.sin ((this.angle * Math.PI) / 180));
        this.dest_y = Math.round ((this.y0 + this.offsetY0) - ((this.x + this.offsetX) - (this.x0 + this.offsetX0)) * Math.sin ((this.angle * Math.PI) / 180) + ((this.y + this.offsetY) - (this.y0 + this.offsetY0)) * Math.cos ((this.angle * Math.PI) / 180));

        this.p = "M " + this.x + " " + this.y + " A " + this.radius + " " + this.radius + " 0 " + (this.angle > 180 ? 1 : 0) + " 0 " + this.dest_x + " " + this.dest_y;
        this.c_svg.setAttribute("d", this.p);

        this.children.map(({child}) => {
            child.redraw();
        });
    }

    calculateAngle(x, y, dest_x, dest_y){
        var angle;
        var pente = (dest_y - y) / (dest_x - x);
        if(dest_x == x)
            angle = -Math.PI/2;
        if(pente == 0)
            angle = 0;
        if( pente >= 0 && (x < dest_x && y < dest_y))
            angle = Math.asin( (Math.sqrt( Math.pow((x - x), 2) + Math.pow((y - dest_y), 2)) ) / ( Math.sqrt( Math.pow((x - dest_x), 2) + Math.pow((y - dest_y), 2))) );
        else if(pente >= 0 && (x > dest_x && y > dest_y))
            angle = Math.PI + Math.asin( (Math.sqrt( Math.pow((x - x), 2) + Math.pow((dest_y - y), 2)) ) / ( Math.sqrt( Math.pow((x - dest_x), 2) + Math.pow((y - dest_y), 2))) );
        else if( pente <= 0 && (x < dest_x && y > dest_y))
            angle =  2 * Math.PI -  Math.asin( (Math.sqrt( Math.pow((x - x), 2) + Math.pow((dest_y - y), 2)) ) / ( Math.sqrt( Math.pow((x - dest_x), 2) + Math.pow((y - dest_y), 2))) );
        else if(pente <= 0 && (x > dest_x && y < dest_y))
            angle =   Math.PI -  Math.asin( (Math.sqrt( Math.pow((x - x), 2) + Math.pow((dest_y - y), 2)) ) / ( Math.sqrt( Math.pow((x - dest_x), 2) + Math.pow((y - dest_y), 2))) );
        return angle;
    }

    resize(pos, dx, dy){
        if(pos == 0){
            this.x += dx;
            this.y += dy;
        }
        else{
            this.dest_x += dx;
            this.dest_y += dy;
        }
        this.children.map(({child}) => {
            child.setRotateAngle((this.calculateAngle() + ( Math.PI * 90)/180));
            child.redraw();
        });
    }

    setRotateCenter(centerX, centerY){
        this.centerX = centerX;
        this.centerY = centerY;
    }
    
    setRotateAngle(angle){
        this.angle = angle;
    }

    setOffsetX(x){
        this.offsetX = x;
    }

    setOffsetY(y){
        this.offsetY = y;
    }

    setOffsetX0(x){
        this.offsetX0 = x;
    }

    setOffsetY0(y){
        this.offsetY0 = y;
    }

    setScaleX(x){
        this.scaleX = x;
    }

    setScaleY(y){
        this.scaleY = y;
    }

    getRotateAngle(){
       return  this.angle;
    }

    getOffsetX(){
        return this.offsetX;
    }

    getOffsetY(){
        return this.offsetY;
    }

    getOffsetX0(){
        return this.offsetX0;
    }

    getOffsetY0(){
        return this.offsetY0;
    }

    getScaleX(){
        return this.scaleX;
    }

    getScaleY(){
        return this.scaleY;
    }


    optimalPath(){

    }
}
export {Arc};