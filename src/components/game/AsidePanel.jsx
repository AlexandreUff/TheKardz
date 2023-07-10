import { useContext, useEffect, useState } from "react";
import { IcoLeftArrow, IcoRightArrow, IcoSendMsg } from "../Icons";
import SocketContext from "../../context/socketContext";
import SessionService from "../../services/SessionService";
import Report from "../game/Report"

export default function AsidePanel(props){

    const [arrowIcon, setArrowIcon] = useState(true);
    const [test,setTest] = useState("");
    const [reports, setReports] = useState([])
    const [userMessage, setUserMessage] = useState("")

    const socket = useContext(SocketContext)

    const { userName, userId, hall} = SessionService.get("userDatas")
    console.log(userName,userId, hall)

    const showAsidePanel = () => {
        const asidePanel = document.querySelector(".aside-panel")
        const showPanel = document.querySelector(".show-panel")
        asidePanel.toggleAttribute("show")
        showPanel.toggleAttribute("show")

        setArrowIcon(!arrowIcon)
    }

    const sendMessage = () => {

        const report = (
            <Report
                author={userName}
                type={"chat"}
                message={userMessage}
                isYou
                hour={new Date()}
                key={reports.length+1}
            />
        )
        
        setReports(
            [...reports, report]
        )

        setUserMessage("")
    }

    useEffect(()=>{
        socket.listen("send",(msg)=>{
            console.log(msg,"ASIDE")
            setTest(msg.msg)
        })

        setTimeout(()=>{
            socket.send("attack", "Context funcionando com sucesso.")
        },15000)
    },[socket])

    return (
        <>
            <aside className="aside-panel">
                <h4>
                    Nº DA SALA:
                </h4>
                <h3>
                    {hall}
                    {test}
                </h3>
                <div className="report-area">
                    <div className="hidder-top-messages"></div>
                    {reports}
                </div>
                <section className="message-container">
                    <textarea 
                        name="message-area"
                        id="msg-area" cols="3"
                        rows="5" 
                        placeholder="Digite aqui sua mensagem."
                        value={userMessage}
                        onChange={e => setUserMessage(e.target.value)}
                    >

                    </textarea>
                    <button title="Enviar" onClick={sendMessage}>
                        <IcoSendMsg />
                    </button>
                </section>
            </aside>
            <div className="show-panel" onClick={showAsidePanel}>
                {arrowIcon ? <IcoLeftArrow /> : <IcoRightArrow />}
            </div>
        </>
    )
}