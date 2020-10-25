import React, {useState} from 'react'
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

import { copyToClipboard } from '../../utility'

const CopyToClipboard = ({value}) => {
    const [copied, setCopied] = useState(false)
    const onClick = () => {
        setCopied(true)
        copyToClipboard(value)
        setTimeout(()=>{
            setCopied(false)
        }, 3000)
    }
    const copyClass = ["copied"]
    if(copied) {
        copyClass.push("active")
    }

    const Icon = copied ? AssignmentTurnedInIcon:AssignmentIcon
    return <div className='copy-to-clipboard clickable' onClick={onClick} role='button'>
        <span className={copyClass.join(" ")}>Copied!</span>
        <Icon/>
    </div>
}




export default CopyToClipboard