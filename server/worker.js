function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5174",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5174",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/validate-answer") {
      const { answer } = await request.json();

      return json({
        correct: answer?.toLowerCase().trim() === "ombra",
      });
    }

    if (request.method === "POST" && url.pathname === "/get-person-info") {
      const { name } = await request.json();
      const normalizedName = name?.toLowerCase().trim();

      const people = {
        simone: {
          name: "Simone",
          role: "Data Engineer",
          points: 10,
          history: "Ciao sono Simone e sono un Data Engineer",
        },
        gianluca: {
          name: "Gianluca",
          role: "Player",
          points: 7,
          history: "Ciao sono Gianluca e sono un player",
        },
      };

      const person = people[normalizedName];

      if (!person) {
        return json({ found: false }, 404);
      }

      return json({
        found: true,
        data: person,
      });
    }

    return json({ message: "Not found" }, 404);
  },
};
