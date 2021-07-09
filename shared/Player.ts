import { Client } from "../client/Client";
import { Game, generateId, updateGame } from "./Game";
import { Utilities } from "./Utilities";
import { EntityState } from "./Entity";
import { BulletState, createBullet, updateBullet } from "./Bullet";
import { BARREL_RADIUS, updateBarrel } from "./Barrel";

export interface PlayerState extends EntityState {
    id: number;
    positionX: number;
    positionY: number;
    aimDir: number;
    moveX: number;
    moveY: number;
    health: number;
    score: number;
    velocityX: number;
    velocityY: number;
}

export const PLAYER_MOVE_SPEED: number = 500; 
export const PLAYER_RADIUS: number = 38;
export const BARREL_LENGTH: number = 45;

export function createPlayer(game: Game): PlayerState {
    let state = {
        id: generateId(game),
        positionX: Utilities.lerp(
            -game.arenaSize / 2,
            game.arenaSize / 2,
            Math.random()
        ),
        positionY: Utilities.lerp(
            -game.arenaSize / 2,
            game.arenaSize / 2,
            Math.random()
        ),
        velocityX: 0,
        velocityY: 0,
        aimDir: 0,
        moveX: 0,
        moveY: 0,
        health: 1,
        score: 0,
    };
    game.state.players[state.id] = state;
    return state;
}

export function updatePlayer(game: Game, state: PlayerState, dt: number) {
    // Move the player based on the move input
    state.velocityX += state.moveX * PLAYER_MOVE_SPEED * dt;
    state.velocityY += state.moveY * PLAYER_MOVE_SPEED * dt;
    state.positionX += state.velocityX * dt;
    state.positionY += state.velocityY * dt;

    // Restrain to bounds
    state.positionX = Math.max(
        state.positionX,
        -game.arenaSize / 2 + PLAYER_RADIUS
    );
    state.positionX = Math.min(
        state.positionX,
        game.arenaSize / 2 - PLAYER_RADIUS
    );
    state.positionY = Math.max(
        state.positionY,
        -game.arenaSize / 2 + PLAYER_RADIUS
    );
    state.positionY = Math.min(
        state.positionY,
        game.arenaSize / 2 - PLAYER_RADIUS
    );
}

export function renderPlayer(
    client: Client,
    state: PlayerState,
    ctx: CanvasRenderingContext2D
) {
    ctx.save();

    ctx.translate(state.positionX, -state.positionY);

    // Draw body
    ctx.save();
    ctx.rotate(Math.atan2(-state.moveY, state.moveX) + Math.PI / 2);
    let bodyWidth =
        client.assets.tankBodyBlue.width * client.assets.scaleFactor;
    let bodyHeight =
        client.assets.tankBodyBlue.height * client.assets.scaleFactor;
    ctx.drawImage(
        client.assets.tankBodyBlue,
        -bodyWidth / 2,
        -bodyHeight / 2,
        bodyWidth,
        bodyHeight
    );
    ctx.restore();

    // Draw barrel
    ctx.save();
    ctx.rotate(state.aimDir + Math.PI / 2);
    let barrelWidth =
        client.assets.tankBarrelBlue.width * client.assets.scaleFactor;
    let barrelHeight =
        client.assets.tankBarrelBlue.height * client.assets.scaleFactor;
    ctx.drawImage(
        client.assets.tankBarrelBlue,
        -barrelWidth / 2,
        -barrelHeight * 0.75,
        barrelWidth,
        barrelHeight
    );
    ctx.restore();


    // Draw health
    let healthY = -PLAYER_RADIUS - 5;
    let healthWidth = 80;
    let healthHeight = 10;
    let healthPadding = 4;
    ctx.save();
    ctx.fillStyle = "#333";
    ctx.fillRect(
        -healthWidth / 2 - healthPadding,
        healthY - healthHeight / 2 - healthPadding,
        healthWidth + healthPadding * 2,
        healthHeight + healthPadding * 2
    );
    ctx.fillStyle = "white";
    ctx.fillRect(
        -healthWidth / 2,
        healthY - healthHeight / 2,
        healthWidth * state.health,
        healthHeight
    );
    ctx.restore();

    // Draw score
    let scoreY = healthY - 25;
    ctx.save();
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 6;
    ctx.font = Utilities.font(32, 700);
    ctx.strokeText(state.score.toString(), 0, scoreY);
    ctx.fillText(state.score.toString(), 0, scoreY);
    ctx.restore();

    ctx.restore();
}

export function shoot(game: Game, state: PlayerState): BulletState {
    let dirX = Math.cos(state.aimDir);
    let dirY = -Math.sin(state.aimDir);

    let bulletX = state.positionX + dirX * BARREL_LENGTH;
    let bulletY = state.positionY + dirY * BARREL_LENGTH;
    return createBullet(
        game,
        state.id,
        bulletX,
        bulletY,
        Math.atan2(dirY, dirX)
    );
}

export function damagePlayer(
    game: Game,
    state: PlayerState,
    amount: number,
    damagerId?: number
) {
    state.health -= amount;
    if (state.health <= 0) {
        onPlayerKill(game, state, damagerId);
    }
}

function onPlayerKill(game: Game, state: PlayerState, killerId?: number) {
    // Give points to the killer
    if (killerId) {
        let killer = game.state.players[killerId];
        if (killer) {
            killer.score += 1;
        }
    }

    // Remove this player
    delete game.state.players[state.id];
}
function x(x: any, arg1: number) {
    throw new Error("Function not implemented.");
}

