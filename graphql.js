import gql from 'graphql-tag';

export const DISTRICT_ALERTS_QUERY = gql`
  query($dname: String) {
    getAlerts(dname: $dname) {
      alerts {
        desc
        mdhm
        city
        id
      }
      tendency
    }
  }
`

export const ALERTS_QUERY = gql`
  query {
    alerts {
      latitude
      longitude
      city
      id
    }
  }
`

export const CREATE_ALERT_MUTATION = gql`
  mutation($desc: String, $email: String, $phone: String, $lat: Float, $long: Float) {
    createAlert(desc: $desc, email: $email, phone: $phone, lat: $lat, long: $long) {
      ok
      error {
        path
        message
      }
    }
  }
`
