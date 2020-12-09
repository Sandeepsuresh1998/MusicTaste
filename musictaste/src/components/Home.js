import React, { Component } from 'react'
import queryString from 'query-string';
import axios from 'axios'
import "../styles/Home.css";
import Navbar from 'react-bootstrap/Navbar'
import TrackPreview from './TrackPreview';

axios.defaults.baseURL = "https://spotifybackend.herokuapp.com"
// axios.defaults.baseURL = "https://localhost:8888";



class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: false, 
            accessToken: '',
            refreshToken: '',
            topTracks: [],
            topArtists: [], 
            name: '',
            email: '', 
            userID: '',
            image: '',
            isPlaying: false, 
            currenlyPlaying: {}, 
        }
        this.topArtists = this.topArtists.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);
        this.getTopTracks = this.getTopTracks.bind(this);
        this.getMyInfo = this.getMyInfo.bind(this);
        this.getTopArtists = this.getTopArtists.bind(this);
        this.getNowPlaying = this.getNowPlaying.bind(this);
    }

    componentDidMount() {
        // Parse Access Token
        let parsed = queryString.parse(window.location.search);
        this.setState({
            accessToken: parsed.access_token,
            refreshToken: parsed.refresh_token
        }, () => {
            //Functions to call after accessToken and refreshToken have been set

            //Get personal info
            this.getMyInfo();

            //Set top tracks 
            this.getTopTracks();

            //Set Top Artists
            this.getTopArtists();

            this.getNowPlaying();
            
        });

        // Get user info
        // TODO: Make this more expansive and add more details to page
        
    }


    // Currently Playing Track
    getNowPlaying() {
        console.log("Now Playing")
        axios.get('/getNowPlaying', {
            params: {
                "accessToken": this.state.accessToken,    
            }  
        }).then((res) => {
            // Get Now playing 
            // TODO: Make now playing dynamic and error robust
            if(res.data) {
                console.log(res.data.item)
                this.setState({
                    isPlaying: true,
                    currenlyPlaying: {
                        name: res.data.item.name, 
                        album_img: res.data.item.album.images[0].url,
                        artists: res.data.item.artists
                    }
                })
            } else {
                this.setState({
                    isPlaying: false,
                })
            }
        })
    }


    //Get basic user info 
    getMyInfo() {
        console.log("Fetching my information");
        axios.get('/myInfo', {
            params: {
                "accessToken": this.state.accessToken,    
            }  
        }).then((res) => {
            if(res.status == 200) {
                const info = res.data.body;
                this.setState({
                    name: info.display_name, 
                    email: info.email,
                    userID: info.id
                })
                if(info.images) {
                    //Set the image url if there is one
                    this.setState({
                        image: info.images[0].url,
                    })
                }
            }
        })
    }   


    // Get info
    // TODO: Change to get top artists and tracks
    topArtists() {
        console.log(this.state.accessToken);
        axios.get('/getTopArtists', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((res) => {
            this.setState({
                topArtists: res.data.items
            })
        })
    }


    // Get a user's playlist
    // TODO: Create UI
    // TODO: Set State
    // TODO: Component did mount call
    getPlaylists() {
        axios.get('/getPlaylists', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((res) => {

            console.log(res);
        })
    }

    //Get a user's artists
    // TODO: Component did mount call
    getTopArtists() {
        axios.get('/getTopArtists', {
            params: {
                "accessToken": this.state.accessToken,  
            }
        }).then((res) => {
            console.log(res.data.items)
            this.setState({
                topArtists: res.data.items
            })
        })
    }

    // TODO: Component did mount call
    // TODO: Error checking on response
    getTopTracks() {
        axios.get('/getTopTracks', {
            params: {
                "accessToken": this.state.accessToken
            }
        }).then((res) => {
            this.setState({
                topTracks: res.data.items
            }) 
        })
    }

    render() {
        return (
            <div className="root">
                {/* This is some navbar code I'll come back to */}
                {/* <Navbar bg="black">
                    <Navbar.Brand href="/home">
                        <img 
                            src={this.state.image}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                </Navbar> */}
                <div className="headerContainer">
                    <h1 style={{color: "#1DB954"}} className="header">Sounds</h1>
                    {this.state.isPlaying ?
                        
                        <TrackPreview 
                            name={this.state.currenlyPlaying.name} 
                            album_img={this.state.currenlyPlaying.album_img}
                            artists={this.state.currenlyPlaying.artists}
                        /> :
                        null
                    }
                </div>
                <div className="homeContainer">
                    <div className="info">
                        <h1>Your Info</h1>
                        <img className="profile" src={this.state.image} />
                        <h1>{this.state.name}</h1>
                        <h1>{this.state.email}</h1>
                    </div>

                    <div className="playlistContainer">
                    </div>

                    <div className="tracksContainer">
                        <h1>My Top Tracks</h1>
                        <ul>
                            {this.state.topTracks.map(listitem => (
                            <li key={listitem.id}>{listitem.name + " - " + listitem.artists[0].name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="artistsContainer">
                        <h1>My Top Artists</h1>
                        <ul>
                            {this.state.topArtists.map(listitem => (
                            <li key={listitem.id}>{listitem.name}</li>
                            ))}
                        </ul>
                    </div>


                    
                </div>
                <button onClick={this.getNowPlaying}>Playlist</button>
                <p>{this.state.accessToken}</p>
            </div>
        )
    }
}

export default Home;