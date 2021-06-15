import tileSandUrl from "./assets/tileSand1.png";
import tankBodyRedUrl from "./assets/tankBody_red_outline.png";
import tankBodyBlueUrl from "./assets/tankBody_blue_outline.png";
import tankBarrelRedUrl from "./assets/tankRed_barrel1_outline.png";
import tankBarrelBlueUrl from "./assets/tankBlue_barrel1_outline.png";
import bulletUrl from "./assets/shotRed.png";
import wallUrl from "./assets/barricadeWood.png";

export class Assets {
    public scaleFactor = 1;

    public tileSand = this._load(tileSandUrl);
    public tankBodyRed = this._load(tankBodyRedUrl);
    public tankBodyBlue = this._load(tankBodyBlueUrl);
    public tankBarrelRed = this._load(tankBarrelRedUrl);
    public tankBarrelBlue = this._load(tankBarrelBlueUrl);
    public bullet = this._load(bulletUrl);
    public wall = this._load(wallUrl);

    private _load(url: string): HTMLImageElement {
        let img = new Image();
        img.src = url;
        return img;
    }
}
