export const getConversationById = async (accessToken, id, axiosJWT) => {
    const response = await axiosJWT.get(`/conversation/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`
        },
        withCredentials: true
    })
    return response.data;
}