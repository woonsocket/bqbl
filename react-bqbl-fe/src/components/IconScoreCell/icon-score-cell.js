import React, { Component } from 'react';

class IconScoreCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team: props.team,
      score: props.score
    };
  }

   divStyles = {
    display: 'inline-block',
    marginLeft: '10px'
  };

  spanStyles = {
    marginLeft: '3px'
  };

  render() {
    return (
        <div style={this.divStyles}>
          <img
            src={
              'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
                'teams-matte/' + this.state.team + '.svg'}
                width='20px'/>
           <span style={this.spanStyles}>
              {this.state.score}
              </span>
        </div>
    )
  }
}
export default IconScoreCell;
