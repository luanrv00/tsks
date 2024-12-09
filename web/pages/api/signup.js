import { apiUserSignup } from "../../services"

export default async function handler(req, res) {
  const {email, password} = req.body
  const user = await apiUserSignup({email, password})

  if (user) {
    try {
      res.status(201).json({ ok: true, data: {user} })
    } catch (e) {
      res.status(500).json({ ok: false, message: '500 Internal Server Error' })
    }
  }
}
