import CardToShow from "./CardToShow"
import Timer from "./Timer"

export default function GameArena(){
    return (
        <main className="game-arena">
            {/* <CardToShow /> */}
            <div className="player-name">
                <div className="unused-area">
                </div>
                <h5 className="top">
                    ADVERSÁRIO
                </h5>
                <h6>
                    {`🏆 ${"2"}  ☠️ ${"1"}`}
                </h6>
            </div>
            <div className="card-list">
                <CardToShow />
                <CardToShow />
                <CardToShow />
            </div>
            <div className="table">
                <Timer time={15} type="match" />
                {/* Fazer a área de logs */}
            </div>
            <div className="card-list my-cards"> {/* O jogador só entra nesse lado */}
                <CardToShow />
                <CardToShow />
                <CardToShow />
            </div>
            <div className="player-name">
                <div className="unused-area">
                </div>
                <h5 className="bottom">
                    VOCÊ
                </h5>
                <h6>
                    {`🏆 ${"3"} ☠️ ${"2"}`}
                </h6>
            </div>
        </main>
    )
}