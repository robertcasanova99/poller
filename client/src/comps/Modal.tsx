
import { Box, Button, Chip, Modal, TextField } from "@mui/material"
import { useState } from "react";
import { Socket } from "socket.io-client";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "320px",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
};

export default function ({ state, dispatch, data, socket }: { dispatch: Function, state: AdminReducer, data: Exam, socket: Socket }) {
    const [chips, setChips] = useState([] as string[])
    const [question, setQuestion] = useState("")
    const [questionHelper, setQuestionHelper] = useState("")
    const [chipHelper, setChipHelper] = useState("")
    return (
        <div>
            <Modal
                keepMounted
                open={state.open}
                onClose={() => dispatch({ type: "close" })}
            >
                <Box sx={style}>
                    <TextField
                        label="Question"
                        multiline
                        variant="standard"
                        value={question}
                        fullWidth
                        onChange={(ev: any) => setQuestion(ev.target.value)}
                        style={{ margin: "0 5px" }}
                        helperText={questionHelper}
                        FormHelperTextProps={{ style: { color: "red" } }}
                    />
                    <TextField
                        id="answers"
                        variant="standard"
                        fullWidth
                        style={{ margin: "5px 5px 0 5px" }}
                        placeholder="Write Answer and press Enter"
                        onKeyDown={(ev: any) => {
                            if (ev.key !== "Enter" || ev.target.value === "" || ev.target.value === "~") return
                            chips.push(ev.target.value)
                            setChips(Array.from(new Set(chips)))
                            ev.target.value = ""
                        }}
                        helperText={chipHelper}
                        FormHelperTextProps={{ style: { color: "red" } }}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        {
                            chips.map((chip, index) => {
                                return <Chip key={index} label={chip} style={{ margin: "5px 5px" }} color={(chip.split("~")[1] || "default") as any} onClick={chipClickHandle(chips, index, chip, setChips)} />
                            })
                        }
                    </div>
                    <Button style={{ width: "auto" }} onClick={() => {
                        let obj: any = {}
                        if (!question) return setQuestionHelper("Type a question")
                        else setQuestionHelper("")
                        if (!chips.find(e => e.includes("~"))) return setChipHelper("Please select an answer")
                        else setChipHelper("")
                        obj = {
                            question,
                            correct: chips.filter(chip => chip.split("~")[1] === "primary")[0].split("~")[0],
                            answers: chips.map(el => el.split("~")[0]),
                            choosen: ""
                        }
                        data[state.id] = (data[state.id] || []).concat(obj)
                        socket.emit("exam", { data, room: state.id })
                        cleanAll(setQuestion, setChips, dispatch);
                    }}>
                        Add
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

function cleanAll(setQuestion: Function, setChips: Function, dispatch: Function) {
    setQuestion("");
    setChips([]);
    (document.getElementById("answers") as HTMLInputElement).value = "";
    dispatch({ type: "close" });
}

function chipClickHandle(chips: string[], index: number, chip: string, setChips: Function) {
    return () => {
        if (chip.includes("~")) return
        let arr = chips.map(el => el.split("~").shift());
        arr[index] = chip + "~primary";
        setChips(arr);
    };
}
