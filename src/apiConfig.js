let apiUrl
const apiUrls = {
  production: 'https://murmuring-anchorage-97253.herokuapp.com/',
  development: 'http://localhost:3000'
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}

// hack to access production api from localhost
// commment out or remove this line to access development api
apiUrl = apiUrls.production

export default apiUrl
