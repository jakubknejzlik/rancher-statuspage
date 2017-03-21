class GetInfo extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            metadata: {},
            loading: true
        };
    }

    componentDidMount(){
        axios.get('/metadata')
            .then(res => {
                document.title = "StatusPage | " + res.data.environment.name;
                this.setState({
                    metadata: res.data,
                    loading: false
                });
            });
    }

    renderLoading(){
        return <div>Loading ...</div>;
    }

    render(){
        return(
            <div className="header clearfix">
                <h3 className="text-muted">{ this.state.loading ? this.renderLoading() : this.state.metadata.environment.name }</h3>
            </div>
        );
    }
}

class Fetch extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            services: [],
            loading: true
        };
    }

    componentDidMount(){
        this.timerID = setInterval(
            () => this.getData(),
            5000
        );
    };

    renderLoading(){
        return <div>Loading ...</div>;
    }

    renderServices(){
        return (

            <ul className ="list-group list-group-flush">
                    {this.state.services.map((service, index) =>
                        <li key={index} className ="list-group-item d-flex justify-content-between">
                            <span>{service.name}</span>
                            <span className ={"badge badge-"+service.status}>{service.statusMessage}</span>
                        </li>
                    )}
                </ul>
        );
    }

    getData(){
        axios.get('/services')
            .then(res => {
                this.setState({
                    services: res.data,
                    loading: false
                });
            });
    }

    render(){
        return (
            <div className ="card">
                { this.state.loading ? this.renderLoading() : this.renderServices()}
            </div>
        )
    };
}

function App(){
    return (
        <div>
           <GetInfo/>
           <Fetch/>
        </div>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
