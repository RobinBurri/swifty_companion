import axios from 'axios'
import { useCallback, useContext } from 'react'
import { API_URL } from '../constants/apiUrl'
import BasicStudent from '../models/BasicStudent'
import { AuthContext } from '../store/auth-context'

// 47 is the campus id for Lausanne
const ALL_LAUSANNE_STUDENTS = '/v2/campus/47/users'

export const useFilteredStudentList = () => {
    const authCtx = useContext(AuthContext)

    const getAllFilteredStudents = useCallback(
        async (filteredLogin: string) => {
            if (!authCtx) {
                console.error('Auth context is not available')
                return
            }

            try {
                const token = await authCtx.getToken()
                let allStudents: BasicStudent[] = []
                let currentPage = 1
                let hasMoreStudents = true
                const queryParameter =
                    '?range[login]=' + filteredLogin + ',' + filteredLogin + 'z'
                while (hasMoreStudents) {
                    const response = await axios.get(
                        `${API_URL}${ALL_LAUSANNE_STUDENTS}${queryParameter}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token?.getToken()}`,
                            },
                            params: {
                                page: currentPage,
                                per_page: 100,
                            },
                        }
                    )

                    const studentsOnPage: BasicStudent[] = response.data.map(
                        (student: any) => createBasicStudent(student)
                    )
                    
                    if (studentsOnPage.length === 0) {
                        hasMoreStudents = false
                    } else {
                        allStudents = [...allStudents, ...studentsOnPage]
                        currentPage++
                    }
                }
                return allStudents
            } catch (error) {
                console.error('Failed to get students:', error)
                return undefined
            }
        },
        [authCtx]
    )

    return { getAllFilteredStudents }
}

const createBasicStudent = (student: any) => {
    let bestImage = student.image?.versions?.small
    if (!bestImage) {
        bestImage = student.image.link
    }
    return new BasicStudent(student.id, bestImage, student.login)
}
