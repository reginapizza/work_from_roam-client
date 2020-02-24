import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import TestComponent from './TestComponent'
import PlacesDetail from './PlacesDetail'
import axios from 'axios'
import apiUrl from '../apiConfig'


class GoogleMap extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedMarker: null,
            showWindow: false,
            allData: []
        }
    }

    // Using geolocation from browser to location user location
    componentDidMount = () => {
      if(navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
        console.log('found user location')
        const coords = pos.coords
        const lat = coords.latitude
        const lng = coords.longitude
        this.props.setApp({ mapCenter: { lat, lng }})
        })
      }
      axios(apiUrl + '/work_spaces')
        .then(data => {
            console.log(data)
            this.setState({ allData: data.data.work_spaces })
        })
    }

    placeDetails = ['name', 'website', 'formatted_phone_number', 'formatted_address', 'photo', 'reference', 'reviews']

    // callback function to handle place details from Google place detail api
    setPlaceData = placeData => {
        console.log(placeData)
        this.props.setApp({ placeData })
    }

    // get place details from google place detail api
    getPlaceDetails = (map, placeId) => {
        const fields = this.placeDetails
        const service = new this.props.google.maps.places.PlacesService(map)
        service.getDetails({ placeId, fields }, this.setPlaceData)
    }

    // set new map poi or marker location and placeId. Reset placeData to null
    setNewLocation = (location, placeId) => {
        this.props.setApp({
            poiLocation: location,
            mapCenter: location,
            placeData: null,
            placeId
        })
    }

    // onClick handler to set marker to state and get place details
    onMarkerClick = (props, marker, event) => {
        this.setState({ selectedMarker: marker })
        const lat = marker.data.lat
        const lng = marker.data.lng
        const placeId = marker.data.place_id
        this.setNewLocation({ lat, lng }, placeId)
        this.getPlaceDetails(props.map, placeId)
    }

    // onClose handler for InfoWindow
    onInfoWindowClose = () => {
        this.setState({ showWindow: false })
    }

    handleClick = (props, map, event) => {
        console.log(map)
        // if click event has a place id (point of interest)
        if(event.placeId) {
            // set new location and get place details for the poi
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()
            const placeId = event.placeId
            this.setNewLocation({ lat, lng }, placeId)
            this.getPlaceDetails(map, placeId) 
        }
    }

    render() {

        return (
            <Map google={this.props.google}
             center={this.props.center}
             initialCenter={this.props.center}
             zoom={14}
             clickableIcons={true}

             onClick={this.handleClick}
            >

                {/* info window for poi locations */}
                <InfoWindow
                    position={this.props.poiLocation}
                    visible={true}
                >
                    <PlacesDetail placeData={this.props.placeData} />
                </InfoWindow>

                {/* create markers for each piece of data */}
                {this.state.allData.map(workSpace => (
                    <Marker onClick={this.onMarkerClick}
                        position={{ lat: workSpace.lat, lng: workSpace.lng}}
                        placeId={workSpace.placeId}
                        data={workSpace}
                        name={'work-space'}
                    />
                ))}
                

                {/* InfoWindow becomes visible when this.state.showWindow === true */}
                <InfoWindow marker={this.state.selectedMarker}
                        visible={this.state.showWindow}
                        onClose={this.onInfoWindowClose}
                >
                    {/* Display placeData information inside InfoWindow */}
                    <TestComponent placeData={this.props.placeData} />

                </InfoWindow>

            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
  })(GoogleMap)
