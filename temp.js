/*
   Free Code Camp - Wiki Search
   Author - Varenya
*/


var SearchBox = React.createClass({

  getInitialState: function(){
    return {text:""};
  },
  handleClick: function(){
    var text = this.state.text.trim();
    if(!text){
      return;
    }
    this.props.onTextChange({text:text});
  },
  handleEnter: function (e) {
    //e.preventDefault();
    //console.log(e);
    //console.log(e.keyCode);
    if(e.keyCode == 13){
      var text = this.state.text.trim();
      if(!text){
        return;
      }
      this.props.onTextChange({text:text});

    }
  },

  handleTextChange: function (e) {
    this.setState( { text : e.target.value } );
  },
  render : function(){
    return (
      <div className="row">
        <div className="input-group">
          <span className="input-group-btn">
            <input className="btn btn-primary" type="submit" value="Go!" onClick={this.handleClick} />
          </span>
          <input type="text" className="form-control" placeholder="Search for..." value={this.state.text}   onChange={this.handleTextChange} onKeyDown={this.handleEnter}/>
        </div>
      </div>
    );
  }
});

var SearchList = React.createClass({

  render: function() {

    var searchResults = this.props.search.map(function(result){
      return (<SearchItem search_data={result} />);
    });
    return (
      <div className="row top-buffer">
        <div className="list-group">
          {searchResults}
        </div>
      </div>
    );
  }


});

var SearchItem = React.createClass({

  getInitialState: function () {
    return {pageid : "#"};
  },
  getPageId: function () {
      var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&callback=?&titles="+this.props.search_data.title;
      $.ajax({
        url: url,
        dataType: 'json',
        type: 'POST',
        headers: { 'Api-User-Agent': 'Example/1.0' },
        success: function(data) {
          var pageid=Object.keys(data.query.pages)[0];
          this.setState( { pageid : pageid});
        }.bind(this),
        error: function(){
          console.error("Error occured file fetching!");
        }
      });
  },
  componentDidMount: function () {
    this.getPageId();
  },
  rawMarkup: function(text) {
   var rawMarkup = text.toString();
   return { __html: rawMarkup };
 },
  render: function() {
    let item = this.props.search_data;
    return (
      <a href={"https://en.wikipedia.org/?curid="+this.state.pageid} className="list-group-item" target="_blank">
       <h4 className="list-group-item-heading">{item.title}</h4>
       <p className="list-group-item-text" dangerouslySetInnerHTML={this.rawMarkup(item.snippet)} />
      </a>
    );
  }
})

var SearchWrapper = React.createClass({
  getSearchResults : function (search_text) {
    var text = search_text.text;
    var url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&callback=?&srsearch="+text;
    //var url = "https://en.wikipedia.org/w/api.php"
    //var queryData = {action:"query",list:"search",prop:"revisions",format:"json",rvprop:"content",srsearch:text};
    $.ajax({
    url: url,
    dataType: 'json',
    type: 'POST',
    headers: { 'Api-User-Agent': 'Example/1.0' },
    success: function(data) {
      this.setState({ search : data.query.search});
    }.bind(this),
    error: function(){
      console.error("Error occured file fetching!");
    }

   });
},

getInitialState: function () {
  return {search: []};
},

render: function() {
  return (
    <div className="container">
      <a className="btn btn-primary btn-lg random" href="http://en.wikipedia.org/wiki/Special:Random" target="_blank"> Random Article</a>
      <SearchBox onTextChange={this.getSearchResults} />
      <SearchList search={this.state.search} />
    </div>
  );
}

});

ReactDOM.render(<SearchWrapper />,document.getElementById('dummy'));
