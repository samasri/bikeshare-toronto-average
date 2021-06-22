// Based on: https://github.com/Nicholas-Chong/covid-dashboard-v2/blob/05b6f05/src/components/stat-card.js

import styled from 'styled-components'

export const StatCard = ({value, name}) => (
  <Wrapper>
    <h2>{value}</h2>
    <p>{name}</p>
  </Wrapper>
)

const Wrapper = styled.div`
  border-radius: 10px;
  background: white;
  flex-grow: 0.15;
  flex-basis: 15%;
  padding: 5px 15px 5px 15px;
  margin-right: 20px;
  margin-bottom: 20px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  @media only screen and (max-width: 702px) {
    max-width: 100%;
    flex-grow: 0;
  }
`

export const StatCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: ${props => props.marginTop ? 20 : 0}px;
  @media only screen and (max-width: 702px) {
    flex-direction: column;
    div:not(:first-child) {
      margin-top: 20px;
    }
  }
`