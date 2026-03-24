export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 group cursor-pointer">
      <div className="bg-gradient-to-br from-pink-100 to-pink-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <div className="text-pink-600">{icon}</div>
      </div>
      <h4 className="text-2xl font-bold text-gray-800 mb-3">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
