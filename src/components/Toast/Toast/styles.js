import styled from 'styled-components'

export const StyledToast = styled.div`
right: 16px;
position: fixed;
max-width: calc(100% - 32px);
transition: all 250ms ease-in;
width: 100%;
`

export const FrameToastRect = styled.div`
display: flex;
position: relative;
justify-content: center;
align-items: center;
height: max-content;
border-radius: 0.75rem;
position: absolute;
right: 0px;
color: rgb(255, 255, 255);
background-color: rgba(10, 50, 30, 0.6);
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);
box-shadow: -3px -3px 8px rgba(0, 0, 0, 0.4), 0px 0px 4px rgba(255, 255, 255, 0.6);
`

export const IconRegion = styled.div`
position: absolute;
left: 0px;
top: 0px;
text-align: center;
height: 100%;
border-radius: 0.75rem 0 0 0.75rem;
background-color: rgb(120, 200, 66);
color: rgb(255, 255, 255);
padding: 1rem;
`
export const TitleDescription = styled.div`
position: relative;
margin-left: 4rem;
padding: 0.5rem 0.5rem 0.5rem 1rem;
`

export const TitleTextArea = styled.div`
color: rgb(200, 255,200);
font-size: 1.2rem;
font-weight: 400;
border-style: none none solid none;
border-width: 1px;
border-color: rgb(100, 160, 100);
margin-bottom: 0.4rem;
`

export const DescriptionTextArea = styled.div`
color: rgb(240, 240, 240);
margin-top: 0.4rem;
font-size: 1.1rem;
white-space: pre-line;
`