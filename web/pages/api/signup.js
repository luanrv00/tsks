export default function handler(req, res) {
  try {
    res.status(201).json({ok: true})
  } catch(e) {
    res.status(500).json({message: '500 Internal Server Error'})
  }
}
