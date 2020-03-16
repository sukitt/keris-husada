import React, { Component } from 'react';
import Slider from 'react-slick';

import { Col } from 'react-bootstrap';
import styled from 'styled-components';
import { BaseUrl } from '../../../services/axios';


  const imgStyle= {
    maxWidth: "1110px",
    maxHeight: "560px",
    width:"100%",
    height:"100%",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.31) 100%)",
    margin: "0px auto"
  }
  const containerStyle={
    margin: "3rem auto 6rem auto",
  }
  const captionContainer = {
    maxWidth: "380px",
    width:"100%",
    background: "#CC9980",
    zIndex:"10",
    marginTop: "-5%",
    marginLeft: "8%",
    display: "block",
    padding:"20px 20px",
    position:"absolute",
  }
  const captionTextStyle={
    fontFamily: "Khula",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "22px",
    lineHeight: "28px",
    color: "#FFFFFF",
    marginBottom: "1.5rem"
  }
  const captionButtonStyle={
    fontFamily: "Source Sans Pro",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "13px",
    lineHeight: "18px",
    textAlign: "center",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#CC9980",
    width: "180px",
    height: "40px",
    backgroundColor: "white",
    padding: "11px 40px",
    textDecoration: "none",
  }
  
  export class HeadSlider extends Component {
    constructor(props) {
      super(props)
      this.titleButton = ''
    }
    
    render() {
      
      const { store, errors } = this.props
      if (Object.keys(errors).length) {
        return (
          <div>
            <h4>Error in HeaderSlider.js</h4>
            <p>{errors.code}</p>
            <p>{errors.status}</p>
          </div>
        )
      }

      return (
        <>
        {/* <Slider {...settings}>
          {store && store.map((item, i) => {
            let img = item.image.replace(/\\/g, '/');
            this.titleButton = item.caption
            return (
              <SliderImg {...this.props} store={store}  />
            )
          })}
        </Slider> */}
        <SliderImg  {...this.props} store={store}  />

        {/* <H2>{this.titleButton}</H2>
        <B>Bandingkan</B> */}
        </>
      )
    }
  }

  const settings = {
    dots: true,
    // infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1500,
  };

  const H2 = styled.h2`
    font-style: normal;
    font-weight: bold;
    font-size: 150%;
    line-height: 28px;
    color: #FFFFFF;
    margin: 10% 0 5% 5%;
    width: 60%;
    text-shadow: 0px 20px 60px rgba(138, 149, 158, 0.2);
  `;
  const Img = styled.img`
    height: auto;
    width: auto;
    box-shadow: 0px 20px 60px rgba(138, 149, 158, 0.2);
  `;

  const B = styled.button`
    /* white */
    border: 1px solid;
    border-color: #FFFFFF;
    background-color: transparent; 
    width: 157.26px;
    height: 40px;
    margin: 0 0 10% 5%;
  `;

  const P = styled.span`
    text-transform: uppercase;
    font-size: 80%;
    text-align: center;
    letter-spacing: 2px;
    color: #FFFFFF;
  `;

  const SliderImg = props => (
    <Slider {...settings}>
      {/* <div style={props.containerStyle}> */}
              {props.store && props.store.map((d, i) => (
                <div>
                  <div 
                    style={{
                      padding: 25,
                      backgroundImage: `url(${BaseUrl}/storage/${d.image.replace(/\\/g, '/')})`, 
                      backgroundRepeat: 'no-repeat',
                      // backgroundSize: 'auto',
                      width: 'auto',
                      height: 'auto',
                      // backgroundAttachment: 'fixed',
                      backgroundPosition: 'center'
                    }} 
                  >
                  <H2>{d.caption}</H2>
                  <B><P>Bandingkan</P></B>
                  </div>
                </div>
              ))}
        {/* </div> */}
    </Slider>
  )


export default HeadSlider