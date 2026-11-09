import type { CareBlock, CareGuide } from "../utils/careGuides";

/* Dibuja un bloque de contenido de una mini guía: párrafo, lista, tabla o consejo */
function Block({ block }: { block: CareBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-sm text-[#1c2b18]/80 leading-relaxed">{block.text}</p>;

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`text-sm text-[#1c2b18]/80 leading-relaxed pl-5 space-y-1.5 marker:text-[#537a63] ${
            block.ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-[#c8ddc0]">
          <table className="w-full text-left text-xs md:text-[13px]">
            <thead className="bg-[#ddefe5] text-[#1c2b18]">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} scope="col" className="px-3 py-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[#1c2b18]/80">
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-t border-[#c8ddc0]">
                  {row.map((cell, i) => (
                    <td key={i} className={`px-3 py-2 align-top ${i === 0 ? "font-semibold text-[#1c2b18]" : ""}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "tip":
      return (
        <p className="text-xs md:text-[13px] text-[#1c2b18] bg-[#87c6a1]/30 rounded-xl px-3 py-2.5 leading-relaxed">
          <strong className="font-semibold">Consejo: </strong>
          {block.text}
        </p>
      );
  }
}

/* Mini guía de texto: mismo estilo de tarjeta que las guías en video */
export default function CareGuideCard({ guide }: { guide: CareGuide }) {
  return (
    <article className="bg-white border border-[#c8ddc0] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#537a63] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
            {guide.id}
          </span>
          <h3 className="font-poppins text-base font-bold text-[#1c2b18]">{guide.title}</h3>
        </div>
        <p className="text-sm text-[#537a63] pl-7 pt-1">{guide.description}</p>
      </div>
      <div className="px-5 pb-5 flex flex-col gap-3">
        {guide.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}
