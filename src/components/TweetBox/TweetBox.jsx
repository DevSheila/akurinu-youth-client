import React, {useState, useEffect} from 'react'
import {Avatar, Button } from '@material-ui/core'
import {useStateValue} from '../../contexts/StateContextProvider'
import db from '../../firebase'
import firebase from 'firebase'
import './TweetBox.css'

import Popover from '@material-ui/core/Popover'
import Picker from 'emoji-picker-react'

import StatusInput from '../StatusInput/StatusInput'
import TabbarMenu from '../../elements/TabbarMenu/TabbarMenu'
import postToCloudinary from '../../helpers/postToCloudinary'
import {getInfo} from '../../helpers/getImageDimension'
import {generateAltText} from '../../helpers/generateAltText'

import Modal from '../../elements/Modal/Modal'
import Spinner from '../../elements/Spinner/Spinner'
import CropPhoto from '../EditPhoto/CropPhotoB'
import AddALT from '../EditPhoto/AddALT'

import CancelIcon from '@material-ui/icons/Cancel'
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined'
import EventNoteSharpIcon from '@material-ui/icons/EventNoteSharp'
import GifOutlinedIcon from '@material-ui/icons/GifOutlined'
import CropIcon from '@material-ui/icons/Crop'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'

const TweetBox = () => {
    const [{user}] = useStateValue()
    const {displayName} = user
    const [profile, setProfile] = useState(null)
    const [tweetMessage, setTweetMessage] = useState('')
    const [altText, setAltText] = useState(generateAltText(user.displayName))
    const [src, setSrc] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [initialImageSize, setinitialImageSize] = useState({width: 0, height: 0})
    const [initialAspectRatio, setinitialAspectRatio] = useState(null)
    const [croppedImageResult, setCroppedImageResult ] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [isLoading, setIsloading] = useState(false)
    const [checkboxError, setCheckboxError] = useState('') // State for checkbox error
    const [tweetMessageError, setTweetMessageError] = useState(''); // State for text message error

    const [radioOption, setRadioOption] = useState(''); // State for radio button selection
    const [radioError, setRadioError] = useState(''); // State for radio button error message

    useEffect(() => {
       db.collection('users').doc(user.id).onSnapshot(snapshot=>{
          setProfile(snapshot.data())
       })
    }, [])

    
    const sendTweet = (e) => {
        e.preventDefault()
        setIsloading(true)

            // Validation check for text message
        if (!tweetMessage.trim()) {
            // If text message is empty, display a warning message
            setIsloading(false);
            setTweetMessageError('Please enter a message');
            return;
        } else {
            setTweetMessageError('');
        }

        
         // Validation check for radio buttons
        if (!radioOption && (user.userType === 'super' || user.userType === 'admin')) {
            // If text message is empty, display a warning message
            setIsloading(false);
            setRadioError('Please select an option');
            return;
        } else {
            setRadioError('');
        }

        if(imageToSend){
            postToCloudinary(imageToSend)
            .then( res=>{

                db.collection('posts').add({
                    altText     : altText,
                    text        : tweetMessage,
                    image       : res,
                    likes       : [],
                    senderId    : user.id,
                    postType    : radioOption ? radioOption : 'post',
                    timestamp   : firebase.firestore.FieldValue.serverTimestamp()
                })

                setTweetMessage('')
                setAltText('')
                setSrc(null)
                setIsloading(false)

            })
            .catch( err=> {
                setIsloading(false)
                return
            })

        } else {

        db.collection('posts').add({
            altText     : altText,
            text        : tweetMessage,
            image       : '',
            likes       : [],
            senderId    : user.id,
            postType    : radioOption ? radioOption : 'post',
            timestamp   : firebase.firestore.FieldValue.serverTimestamp()
        })

        setTweetMessage('')
        setAltText('')
        setSrc(null)
        setIsloading(false)
        setRadioOption('')

        }
    }

    const onSelectFile = e => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            setSrc(fileReader.result)
            setImageToSend(fileReader.result)
        }   
        fileReader.readAsDataURL(e.target.files[0])

        getInfo(e).then(res=> {
            setinitialImageSize({width: res.width, height: res.height})
        })
    }

    useEffect(() => {
        setinitialAspectRatio(initialImageSize.width/initialImageSize.height)
    }, [initialImageSize])

    const changeSrc = () => {
        setSrc(URL.createObjectURL(croppedImageResult))
        setImageToSend(croppedImageResult)
    }

    const callbackforModal = () =>{
        changeSrc()
        if (altText.length === 0){
            setAltText(generateAltText(displayName))
        }
    }

    const items = [
        {
            id: 0,
            title:'',
            icon: <CropIcon />,
            item: <CropPhoto 
                    image={src} 
                    setCroppedImageResult ={setCroppedImageResult} 
                    initialAspectRatio    = {initialAspectRatio}
            />
        },
        {
            id: 1,
            title: 'ALT',
            icon: '',
            item: <AddALT image={croppedImageResult} altText={altText} setAltText={setAltText}/>
        }
    ]

    const open = Boolean(anchorEl)
    const id = open ? 'post-popover' : undefined
    const onClickEmoticon = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const onEmojiClick = (event, emojiObject) => {
        let newMessage = tweetMessage + emojiObject.emoji
        setTweetMessage(newMessage)
    }

    useEffect(() => {
        var textarea = document.querySelector('textarea')
        textarea.addEventListener('keydown', autosize)
                    
        function autosize(){
        var el = this
        setTimeout(function(){
            el.style.cssText = 'height:auto padding:0'
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box'
            el.style.cssText = 'height:' + el.scrollHeight + 'px'
        },0)
        }
        // text = document.body.innerHTML.replace(/(Socket|Database|Scrapper)(\s*:)/gi, '<span style="color:blue">$1</span>$2');
        // console.log( text );
        // document.body.innerHTML = text;
    }, [])

    // Function to handle radio button selection
    const handleRadioChange = (e) => {
        setRadioOption(e.target.value);
        console.log("radio option",e.target.value)
    };

    const dismissTweetMessageError = () => {
        setTweetMessageError('');
    };

    const dismissRadioButtonError = () => {
        setRadioError('');
    };


    return (
        <>

            <Modal  open={isOpenModal} 
                    onClose={()=>setIsOpenModal(false)}
                    title="Edit Photo"
                    callback = {callbackforModal}
                    Icon = {ArrowBackOutlinedIcon}
                    ButtonText='Save'
                    >
                    <TabbarMenu items={items}/>
            </Modal>
            

            <div className='tweetBox'>
                <form onSubmit={sendTweet}>
                    <div className='tweetBox__wrapperInput' >
                        <div className="tweetBox__ava">
                            <Avatar src={profile && profile.photoURL} />   
                        </div>

                        <div className='tweetBox__input'>

                            <textarea rows='1' 
                                      placeholder="What's happening"
                                      type        = 'text' 
                                      value       = {tweetMessage}
                                      onChange    = {e=> setTweetMessage(e.target.value)}                            
                            >
                            </textarea>


                            {(user.userType === 'super' || user.userType === 'admin') && (
                            <div className="radio-container">
                                <h3>Choose Post Type</h3>
                                <label>
                                    <input type="radio" name="radioOption" value="announcement" onChange={handleRadioChange} />
                                    <span className="custom-radio"></span> Announcement
                                </label>
                                <label>
                                    <input type="radio" name="radioOption" value="post" onChange={handleRadioChange} />
                                    <span className="custom-radio"></span> Regular Post
                                </label>
                            </div>
                            )}

                         
                            {tweetMessageError && (
                                <div className="custom-alert">
                                    <span>{tweetMessageError}</span>
                                    <button className="close" onClick={dismissTweetMessageError}>X</button>
                                </div>
                            )}
                            {/* Error message for radio buttons */}
                            {radioError && (
                                <div className="custom-alert">
                                    <span>{radioError}</span>
                                    <button className="close" onClick={dismissRadioButtonError}>X</button>
                                </div>
                            )}
                            
                            {
                                src &&
                                    <div className='tweetBox__input-image'>
                                        <CancelIcon className='cancelIcon' onClick={()=>setSrc(null)}/>
                                        <img src={src} alt="new test"/>               
                                        <Button className='editImage' onClick={()=>setIsOpenModal(true)}>Edit</Button>
                                    </div>                        
                            }

                            <div className='tweetBox__input-actions'>
                                <div className='tweetBox__input-icons'>
                                   <StatusInput Icon={ImageOutlinedIcon}
                                                type="file"
                                                accept="image/*"
                                                name="image-upload"
                                                id="input-image"
                                                onChange={onSelectFile}
                                    />
                                   {/* <StatusInput Icon={GifOutlinedIcon}/> */}
                                   {/* <StatusInput Icon={EqualizerOutlinedIcon} /> */}
                                   {/* <StatusInput Icon={EventNoteSharpIcon} /> */}

                                   <StatusInput Icon={SentimentSatisfiedOutlinedIcon} 
                                                aria-describedby={id} type="button" onClick={onClickEmoticon} 
                                   />

                                    <Popover 
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}

                                    style={{borderRadius: '2rem'}}
                                    >
                                        <Picker onEmojiClick={onEmojiClick} />
                                    </Popover>

                                </div>
                    
                                {
                                    isLoading ?
                                    <Button className='tweetBox__tweetButton'><Spinner /></Button>
                                    :
                                    <Button type='submit'className='tweetBox__tweetButton'>
                                        {/* <i className="material-icons" >send</i> <h3>POST</h3>  */}
                                        Post
                                    </Button>
                                }

                            </div>
                        </div>    
                    </div>
                </form>
            </div>
        </>
    )
}

export default TweetBox