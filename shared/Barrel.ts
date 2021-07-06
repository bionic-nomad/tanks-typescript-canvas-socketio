import { Client } from "../client/Client";
import { EntityState } from "./Entity";
import { Game, generateId } from "./Game";

export interface BarrelState extends EntityState {
    id: number;
    positionX: number;
    positionY: number;
}

export function createBarrel(
    game: Game,
    positionX: number,
    positionY: number
): BarrelState {
    let state = {
        id: generateId(game),
        positionX: positionX,
        positionY: positionY,
    };
    game.state.barrels[state.id] = state;
    return state;
}

export function renderBarrel(
    client: Client,
    state: BarrelState,
    ctx: CanvasRenderingContext2D
) {
    ctx.save();

    ctx.translate(state.positionX, -state.positionY);

    // Draw bullet
    ctx.save();
    ctx.translate(state.positionX, -state.positionY);
    let bulletWidth = client.assets.bullet.width * client.assets.scaleFactor;
    let bulletHeight = client.assets.bullet.height * client.assets.scaleFactor;
    ctx.drawImage(
        client.assets.bullet,
        -bulletWidth / 2,
        -bulletHeight / 2,
        bulletWidth,
        bulletHeight
    );
    ctx.restore();

    ctx.restore();
}
