import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function QuestionAsker({ question, answers, hookChoosen, setChoosen }: Question & { setChoosen: Function,hookChoosen:string }) {
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChoosen((event.target as HTMLInputElement).value);
    };

    return (
        <FormControl>
            <FormLabel>{question}</FormLabel>
            <RadioGroup
                name="controlled-radio-buttons-group"
                value={hookChoosen}
                onChange={handleChange}
            >
                {
                    answers.map((answer, index) => <FormControlLabel key={index} value={answer} control={<Radio />} label={answer} />)
                }
            </RadioGroup>
        </FormControl>
    );
}