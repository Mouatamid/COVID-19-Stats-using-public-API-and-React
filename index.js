const root = document.getElementById("root");
const fetchUrl = "https://api.covid19api.com/summary";
// let countriesArray = [<Country isActive={true} country={"Global"} />];

//Classes
class Country extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    this.props.countryClick(e.target.textContent);
  }
  render() {
    return (
      <li
        className={this.props.isActive ? "country active" : "country"}
        onClick={this.handleClick}
      >
        {this.props.country}{" "}
      </li>
    );
  }
}
class CountriesList extends React.Component {
  render() {
    return <ul className="countriesList">{this.props.contents}</ul>;
  }
}
class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e) {
    this.props.inputChange(e.target.value);
  }
  render() {
    return (
      <input
        type="text"
        className="search"
        placeholder="Search"
        onChange={this.inputChange}
      />
    );
  }
}
class SecondComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Global",
      allCountries: [],
      inputValue: "",
      countries: [],
    };
    this.changeInput = this.changeInput.bind(this);
    this.countryClick = this.countryClick.bind(this);
  }
  componentDidMount() {
    fetch(fetchUrl)
      .then((data) => data.json())
      .then((data) => data.Countries)
      .then((countries) => {
        let globale = [
          {
            country: "Global",
            key: "Gl",
          },
        ];
        let countriesArray = [];

        if (this.state.inputValue === "") {
          countriesArray = countries.map((country) => {
            return {
              country: country.Country,
              key: country.CountryCode,
            };
          });
          this.setState({
            allCountries: globale.concat(countriesArray),
          });
        } else {
          console.log("Chen");
        }
      });
  }
  changeInput(value) {
    this.setState({
      inputValue: value,
    });
  }
  countryClick(country) {
    this.setState({
      selected: country,
    });
    this.props.selectedCountry(country);
  }
  render() {
    let countriesToShow = [];
    if (this.state.inputValue == "") {
      countriesToShow = this.state.allCountries.map((country) => {
        return (
          <Country
            isActive={this.state.selected.trim() == country.country}
            country={country.country}
            key={country.key}
            countryClick={this.countryClick}
          />
        );
      });
    } else {
      countriesToShow = this.state.allCountries.map((country) => {
        if (
          country.country
            .toLowerCase()
            .startsWith(this.state.inputValue.toLowerCase())
        ) {
          return (
            <Country
              isActive={this.state.selected.trim() == country.country}
              country={country.country}
              key={country.key}
              countryClick={this.countryClick}
            />
          );
        }
      });
    }
    return (
      <div className="secondComponant">
        <SearchInput inputChange={this.changeInput} />
        <CountriesList
          selectedCountry={this.state.selected}
          inputValue={this.state.inputValue}
          contents={countriesToShow}
        />
      </div>
    );
  }
}
class CountryInfo extends React.Component {
  render() {
    return (
      <div className="countryInfo">
        <h3 className="font-weight-bold">{this.props.selected}</h3>
        <div>
          <span className="newConfirmed text-info font-weight-bold">
            New confirmed : {this.props.info.NewConfirmed}
          </span>
          <span className="newRecovered text-success font-weight-bold">
            New recovered : {this.props.info.NewRecovered}
          </span>
          <span className="newDeaths font-weight-bold text-danger">
            New deaths : {this.props.info.NewDeaths}
          </span>
        </div>
        <div>
          <h3>
            Total recovered :{" "}
    <p className="text-success text-center font-weight-bold">{this.props.info.TotalRecovered} </p>
          </h3>
          <h3>
            Total confirmed :{" "}
            <p className="font-weight-bold text-center">{this.props.info.TotalConfirmed}</p>
          </h3>
          <h3>
            Total deaths :{" "}
            <p className="text-danger text-center font-weight-bold">{this.props.info.TotalDeaths}</p>
          </h3>
        </div>
      </div>
    );
  }
}
class MainComponent extends React.Component {
  render() {
    return (
      <div className="mainComponant">
        <h2 className="text-center">Coronavirus COVID-19 stats</h2>
        <CountryInfo selected={this.props.selected} info={this.props.countryInfo} />
      </div>
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Global",
      allCountries: [],
      info : {}
    };
    this.countryClick = this.countryClick.bind(this);
  }
  componentDidMount() {
    fetch(fetchUrl)
      .then((data) => data.json())
      .then((data) => {
        let globale = [
          {
            country: "Global",
            key: "Gl",
            NewConfirmed : data.Global.NewConfirmed,
            TotalConfirmed : data.Global.TotalConfirmed,
            NewDeaths : data.Global.NewDeaths,
            TotalDeaths : data.Global.TotalDeaths,
            NewRecovered : data.Global.NewRecovered,
            TotalRecovered : data.Global.TotalRecovered
          },
        ];
        let countriesArray = [];
        countriesArray = data.Countries.map((country) => {
          return {
            country: country.Country,
            key: country.CountryCode,
            NewConfirmed : country.NewConfirmed,
            TotalConfirmed : country.TotalConfirmed,
            NewDeaths : country.NewDeaths,
            TotalDeaths : country.TotalDeaths,
            NewRecovered : country.NewRecovered,
            TotalRecovered : country.TotalRecovered
          };
        });
        this.setState({
          allCountries: globale.concat(countriesArray),
          info : {
            NewConfirmed : globale[0].NewConfirmed,
            TotalConfirmed : globale[0].TotalConfirmed,
            NewDeaths : globale[0].NewDeaths,
            TotalDeaths : globale[0].TotalDeaths,
            NewRecovered : globale[0].NewRecovered,
            TotalRecovered : globale[0].TotalRecovered
          }
        });
      })
      
  }
  countryClick(country) {
    country = country.trim();
    let info = {};
    this.state.allCountries.forEach(countryArray => {
      if(countryArray.country === country){
        info.NewConfirmed = countryArray.NewConfirmed,
        info.NewDeaths = countryArray.NewDeaths,
        info.NewRecovered = countryArray.NewRecovered,
        info.TotalRecovered = countryArray.TotalRecovered,
        info.TotalConfirmed = countryArray.TotalConfirmed,
        info.TotalDeaths = countryArray.TotalDeaths
      }
    });
    this.setState({
      selected: country,
      info : info
    });
  }
  render() {
    return (
      <div className="app">
        <SecondComponent selectedCountry={this.countryClick} />
        <MainComponent selected={this.state.selected} countryInfo={this.state.info} />
      </div>
    );
  }
}

ReactDOM.render(<App />, root);
