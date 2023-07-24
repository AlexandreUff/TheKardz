import { useContext, useEffect, useState } from "react";
import CardToShow from "./CardToShow";
import Timer from "./Timer";
import SocketContext from "../../context/socketContext";
import SessionService from "../../services/SessionService";
import ReadableMovementsNames from "../../Utils/ReadableMovementsNames";

export default function GameArena() {
  const [stageMatch, setStageMatch] = useState("stand-by");
  const [playersAreFighting, setPlayersAreFighting] = useState([]);
  const [chosenMoviment, setChosenMoviment] = useState();
  const [cardsOfPlayerII, setCardsOfPlayerII] = useState([
    {
      cardName: "attack1",
      amount: 1,
      type: "default",
    },
    {
      cardName: "defense1",
      amount: Infinity,
      type: "default",
    },
    {
      cardName: "recharging1",
      amount: Infinity,
      type: "default",
    },
  ])
  const [cardsOfPlayerI, setCardsOfPlayerI] = useState([
    {
      cardName: "attack1",
      amount: 1,
      type: "default",
      selected: false,
    },
    {
      cardName: "defense1",
      amount: Infinity,
      type: "default",
      selected: false,
    },
    {
      cardName: "recharging1",
      amount: Infinity,
      type: "default",
      selected: false,
    },
  ])

  const socket = useContext(SocketContext);

  const { userName, userId, hall } = SessionService.get("userDatas");

  useEffect(() => {
    
    socket.listen("fight-status", (status) => {
      setStageMatch(status);
    });

    socket.listen("getUsers", (users) => {
      let playersWillFight = users.filter((user) => {
        return user.lineNumber === 0 || user.lineNumber === 1;
      });

      if (playersWillFight.length > 1) {
        const onlyUsersId = [playersWillFight[0]._id, playersWillFight[1]._id];
        const index = onlyUsersId.indexOf(userId);

        if (index !== -1 && index !== 0) {
          const temp = playersWillFight[1];
          playersWillFight[1] = playersWillFight[0];
          playersWillFight[0] = temp;
        }

        setPlayersAreFighting([...playersWillFight]);
      } else {
        setPlayersAreFighting([...users]);  /* Já pôr o player aguardante aqui */
      }
    });
  }, [/* playersAreFighting,  */socket]);

  useEffect(()=>{
    console.log("Atualizou")
  },[playersAreFighting])


  const sendStartRoundStatus = () => {
    console.log("SENDSTARTFUNC",playersAreFighting[0])
    if(playersAreFighting[0]._id === userId && playersAreFighting[0].lineNumber === 0){
      console.log(`${playersAreFighting[0].name} de ${playersAreFighting[0].lineNumber} iniciou a partida.`);
      socket.send("starting-round");
    }
  }

  const sendChosenMoviment = () => {
    if(playersAreFighting[0]._id === userId || playersAreFighting[1]._id === userId){
      const movementIndexWillBeSent = cardsOfPlayerI.findIndex(card => card.selected === true)
      let movementWillBeSent;
  
      if(movementIndexWillBeSent === -1){
        movementWillBeSent = {
          cardName: "recharging1",
          amount: Infinity,
          type: "default",
        }
      } else {
        movementWillBeSent = cardsOfPlayerI[movementIndexWillBeSent]
      }

      //Envio provisório aleatório de dado
      const randomNumber = Math.floor(Math.random() * (cardsOfPlayerI.length-1 - 0 + 1)) + 0

      const movementDataWillSend = {
        player: {
          userName: userName,
          userId: userId,
          lineNumber: playersAreFighting[0].lineNumber
        },
        movement: {
          ...movementWillBeSent
        }
      }

      /* if(cardsOfPlayerII[randomNumber].amount === 1){
        const newMovements = [...cardsOfPlayerII];
        newMovements.splice(randomNumber, 1);
        console.log("MENOS:", newMovements)
        setCardsOfPlayerII([...newMovements])
      } else {
        const newMovements = [...cardsOfPlayerII]
        newMovements[randomNumber].amount--
        console.log("--Amount:", newMovements)
        setCardsOfPlayerII([...newMovements])
      } */
  
      socket.send("chosen-movement", movementDataWillSend)
    }
  }

  return (
    <main className="game-arena">
      {/* <CardToShow /> */}
      <div className="player-name">
        <div className="unused-area"></div>
        <h5 className="top">
          {playersAreFighting.length > 1 && playersAreFighting[1].name}
        </h5>
        <h6>
          {playersAreFighting.length > 1 &&
            `🏆 ${playersAreFighting[1].victories}  ☠️ ${playersAreFighting[1].loses}`}
        </h6>
      </div>
      <div className="card-list">
      {cardsOfPlayerII.map((card, i) => {
          return <CardToShow
                    key={i}
                  />
        })}
      </div>
      <div className="table">
        {stageMatch === "start-fight" && (
          <Timer
            time={10}
            type="match"
            action={sendStartRoundStatus}
          />
        )}
        {stageMatch === "start-round" && (
          <Timer
            time={5}
            action={sendChosenMoviment}
          />
        )}
        {stageMatch === "stand-by" &&
          (playersAreFighting.length > 1 ? (
            <h3>Obtendo dados da partida...</h3>
          ) : (
            <h3>
              Aguarde a entrada <br /> de mais jogadores.
            </h3>
          ))}
        {/* {(
                    playersAreFighting.length > 1 ?
                    <h3>Obtendo dados da partida...</h3> : <h3>Aguarde a entrada <br /> de mais jogadores.</h3>
                )} */}

        {/* Fazer a área de logs */}
      </div>
      <div className="card-list my-cards">
        {" "}
        {/* O jogador só entra nesse lado */}
        {/* Verifica se é o você o jogador. Caso não, os dados não podem ser passados no card */}
        {playersAreFighting.length > 1 && (playersAreFighting[0].name === userName) ?
          cardsOfPlayerI.map((card, i) => {
            return <CardToShow
                      moviment={card.cardName}
                      type={card.type}
                      show={stageMatch === "start-round"}
                      amount={card.amount}
                      chooseMov={() => {
                        setChosenMoviment({...card})
                        const newCards = [...cardsOfPlayerI]
                        newCards[i].selected = true
                        setCardsOfPlayerI([...newCards])
                      }}
                      key={i}
                    />
          }) : (
            cardsOfPlayerI.map((card, i) => {
              return <CardToShow
                        key={i}
                      />
            })
          )}
      </div>
      <div className="player-name">
        <div className="unused-area">
          {!!chosenMoviment && (
            <div className="selected-mov-content">
              {ReadableMovementsNames(chosenMoviment.cardName, chosenMoviment.type)}
            </div>)
          }
        </div>
        <h5 className="bottom">
          {playersAreFighting.length > 1 && (playersAreFighting[0].name === userName ?
           <>{playersAreFighting[0].name} <br /><small>(Você)</small></> : (playersAreFighting[0].name))}
        </h5>
        <h6>
          {playersAreFighting.length > 1 &&
            `🏆 ${playersAreFighting[0].victories}  ☠️ ${playersAreFighting[0].loses}`}
        </h6>
      </div>
    </main>
  );
}
