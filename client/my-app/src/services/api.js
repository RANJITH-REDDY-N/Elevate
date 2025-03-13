const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fetchAPI = async (URL, method = 'GET', data = null, authRequired = false) => {
    try {
        const token = localStorage.getItem('jwtToken');  
        const options = {
            method,
            headers: { 
                'Content-Type': 'application/json',
            },
        };
        if (authRequired && token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${URL}`, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("API Error:", error);
        return { error: error.message };
    }
};

export const fetchMediaAPI = async (URL, method = 'GET', data = null) => {
    try {
        const options = {
            method,
            headers: {
                "accept": "*/*", 
            },
        };

        if (data) {
            options.body = data; 
        }

        const response = await fetch(`${API_BASE_URL}${URL}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Signup API Error:", error);
        return { error: error.message };
    }
};


export const userAuth = async (data) =>  {
    const response = await fetchAPI('/auth/login', 'POST', data);
    if(response.token) {
        localStorage.setItem('jwtToken', response.token);
    }
    return response
}
export const createUser = (data) => fetchMediaAPI(`/auth/users/signup`, 'POST', data);
export const getUserClubs = (id) => fetchAPI(`/api/user/${id}`, 'GET');
export const fetchUserData = (email) => fetchAPI(`/student/users/email?email=${email}`, 'GET', null, true);
export const fetchUserRequestClubs = (userId) => fetchAPI(`/student/club-requests/user/${userId}?status=ALL`, "GET",null, true)
export const fetchUserClubs = (userId) => fetchAPI(`/student/user-clubs/${userId}`, 'GET', null ,true)


// Clubs API
export const fetchAllClubs = () => fetchAPI("/student/clubs", "GET", null, true);
export const requestToJoinClub = async (data) => {
    const url = `/student/club-requests?userId=${data.userId}&clubId=${data.clubId}&userComment=${encodeURIComponent(data.userComment)}`;
    return fetchAPI(url, "POST", null, true);
};


// Announcements API
export const fetchAnnouncements = (data) => fetchAPI(`/student/announcements/${data.userId}/club/${data.clubId}?type=ANNOUNCEMENT&page=${data.page}&size=${data.size}`, 'GET', null, true);

