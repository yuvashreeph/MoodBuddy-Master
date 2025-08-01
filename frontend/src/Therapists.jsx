import React from "react";

const Therapists = () => {
  const therapists = [
    { id: 1, name: "Therapist 1", status: "Available" },
    { id: 2, name: "Therapist 2", status: "Available" },
  ];

  return (
    <div>
      <h2>Connect with Therapists</h2>
      <ul>
        {therapists.map((therapist) => (
          <li key={therapist.id}>
            {therapist.name} - {therapist.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Therapists;
