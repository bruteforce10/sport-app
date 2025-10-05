"use client";

export default function DescriptionSection({ community }) {
console.log(community);


  // Function to convert line breaks to <br> tags
  const formatDescription = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-custom mb-4">Tentang Komunitas</h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {formatDescription(community.description)}
      </div>
    </div>
  );
}
