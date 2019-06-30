import React, { Component } from 'react';

class IconScoreCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: props.team,
      score: props.score
    };
  }


  render() {
    return (
        <div>
          <img
            src={
              'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
                'teams-matte/' + this.state.team + '.svg'}
                width='20px'/>

              {this.state.score}
        </div>
    )
  }
}
export default IconScoreCell;
