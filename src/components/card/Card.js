import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Api from "../../service/SwapiApiService";
import CardButton from "./CardButton";
import Loader from "./CardLoader";

class Card extends Component {
  state = {
    error: null,
    planetId: null,
    cardData: null,
  };

  componentDidMount() {
    this.getRandomPlanet();
  }

  render() {
    const {cardData, error} = this.state;
    const {printCardData} = this;

    if (true === error) {
      return null;
    }

    if (null === cardData) {
      return (
        <CardLayout id="Card">
          <CardBox>
            <Loader />
          </CardBox>
        </CardLayout>
      );
    }

    return (
      <CardLayout id="Card">
        <CardBox>
          <CardData>
            <CardName>
              <h2>{cardData.name.toUpperCase()}</h2>
            </CardName>
              <ListData>
                {printCardData(cardData)}
              </ListData>
          </CardData>
          <CardButton getRandomPlanet={this.getRandomPlanet} />
        </CardBox>
      </CardLayout>
    );
  }

  getRandomPlanet = async id => {
    this.setState({ planetId: null, cardData: null });
    const data = await Api.getRandomPlanet();
    if(false === data ){
      this.props.setAlert('error', 'Api Response Not Found. Try Again Later.', 'Card');
      this.setState({error: true});
      return false;
    }
    const { name, population, climate, terrain, films } = data;
    this.setState({
      planetId: id,
      cardData: {
        name,
        population,
        climate,
        terrain,
        films
      }
    });
  };

  printCardData = (data) =>{

    const arrEntries = Object.entries(data);

    const list = arrEntries.map((el,i) => {
      const key = arrEntries[i][0].toString().toUpperCase();
      const listItemValue = arrEntries[i][1].toString().toUpperCase();


      if('NAME' === key){
        return false;
      }

      if('FILMS' === key){
        const filmsCount = arrEntries[i][1].length;

        const listFilmValue =
        (filmsCount > 1) ? `Featured In: ${filmsCount} Films` :
        (filmsCount === 0 ) ? 'Not Featured in Films':
        (filmsCount === 1) ? `Featured In: ${filmsCount} Film`:
        '';
        return (
          <li className="list-item film-item" key={i}>
            <span>{listFilmValue.toUpperCase()}</span>
          </li>
        );
      }

      return (
        <li className="list-item" key={i}>
          <span>{key}:</span> {listItemValue}
        </li>
      );
    });

    return list;

  }
}

const CardLayout = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  `;

  const CardBox = styled.div`
  width:300px;
`;

const CardName = styled.div`
  padding: 10px 20px;
  border-bottom:2px solid #000;
`;
const CardData = styled.div`
  background: #fff;
  border: 10px solid #FFE919;
  width:100%;
`;

const ListData = styled.ul`
  padding: 10px 20px;
  list-style: none;
  span {
    font-weight: bold;
  }
  .film-item {
    text-align: center;
    font-size: 0.9em;
    text-align: center;
    padding-top: 30px;
  }
`;

Card.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default Card;

