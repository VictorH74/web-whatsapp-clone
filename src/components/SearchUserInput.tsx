import { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchUserInput({ value, onChange }: Props) {
  return (
    <div className="relative grid">
      <div className="absolute top-1/2 left-4 -translate-y-1/2  h-auto w-auto">
        <SearchIcon sx={{ fontSize: 20 }} />
      </div>

      <input
        autoComplete="none"
        name="email"
        type="text"
        className="bg-[#202C33] p-2 pl-14 rounded-md autofill:none text-sm"
        value={value}
        onChange={onChange}
        placeholder="Pesquisar email do usuário"
      />
    </div>
  );
}
