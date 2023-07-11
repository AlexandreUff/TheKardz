import { useContext, useEffect, useState } from "react";
import { IcoLeftArrow, IcoRightArrow, IcoSendMsg } from "../Icons";
import SocketContext from "../../context/socketContext";
import SessionService from "../../services/SessionService";
import Report from "../game/Report"
import ReportModel from "../../Utils/ReportModel";

export default function AsidePanel(props){

    const [arrowIcon, setArrowIcon] = useState(true);
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

        const report = new ReportModel(
                userName,
                "chat",
                userMessage,
                false,
                new Date(),
            )
        
        socket.send("report", report)

        report.isYou = true
        
        setReports(
            [...reports, <Report
                data={report}
                key={reports.length+1}
            />]
        )

        setUserMessage("")
    }

    useEffect(()=>{
        socket.listen("report",(APIReport) => {
            const report = new ReportModel(
                APIReport.author,
                APIReport.type,
                APIReport.message,
                APIReport.isYou,
                APIReport.hour,
            )
        
        setReports(
            [...reports, <Report
                data={report}
                key={reports.length+1}
            />]
        )
        })

    },[reports, socket])

    return (
        <>
            <aside className="aside-panel">
                <h4>
                    Nº DA SALA:
                </h4>
                <h3>
                    {hall}
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