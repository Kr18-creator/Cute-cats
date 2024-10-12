import Card from "./components/Card";

const documents = [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

export default function Home() {

  return (
    <>
      <h1>Home</h1>
      <div className="grid grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card 
            key={doc.position} // Ensure each card has a unique key
            document={doc}
          />
        ))}
      </div>
    </>
  );
}

