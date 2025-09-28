export default function DescriptionSection({ community }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-custom mb-4">Tentang Komunitas</h2>
      <p className="text-gray-700 leading-relaxed">
        {community.description}
      </p>
    </div>
  );
}
