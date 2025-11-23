import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  ValidationError,
  NetworkError,
  NotFoundError,
  success,
  failure,
  tryCatch,
  tryCatchSync,
  isNonEmpty,
  isDefined,
  isNonEmptyString,
  getErrorMessage,
  getErrorCode,
  isNetworkError,
  isValidationError,
  isNotFoundError,
} from "@/lib/utils/errors";

describe("Error Classes", () => {
  it("ValidationError armazena field e code", () => {
    const error = new ValidationError("Email inválido", "email", "INVALID_FORMAT");
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("Email inválido");
    expect(error.field).toBe("email");
    expect(error.code).toBe("INVALID_FORMAT");
  });

  it("NetworkError armazena statusCode e endpoint", () => {
    const error = new NetworkError("Servidor indisponível", 503, "/api/users");
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("NetworkError");
    expect(error.statusCode).toBe(503);
    expect(error.endpoint).toBe("/api/users");
  });

  it("NotFoundError armazena resourceType e resourceId", () => {
    const error = new NotFoundError("Usuário não encontrado", "user", "123");
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("NotFoundError");
    expect(error.resourceType).toBe("user");
    expect(error.resourceId).toBe("123");
  });
});

describe("Result Helpers", () => {
  it("success cria resultado de sucesso", () => {
    const result = success({ id: 1, name: "Test" });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ id: 1, name: "Test" });
    }
  });

  it("failure cria resultado de erro", () => {
    const error = new Error("Falha");
    const result = failure(error);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });
});

describe("tryCatch", () => {
  it("retorna success quando promise resolve", async () => {
    const fn = async () => "Sucesso";
    const result = await tryCatch(fn);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Sucesso");
    }
  });

  it("retorna failure quando promise rejeita", async () => {
    const fn = async () => {
      throw new Error("Falha");
    };
    const result = await tryCatch(fn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Falha");
    }
  });

  it("converte non-Error em Error", async () => {
    const fn = async () => {
      throw "String error";
    };
    const result = await tryCatch(fn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("String error");
    }
  });
});

describe("tryCatchSync", () => {
  it("retorna success quando função executa sem erro", () => {
    const fn = () => 42;
    const result = tryCatchSync(fn);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it("retorna failure quando função lança erro", () => {
    const fn = () => {
      throw new Error("Sync error");
    };
    const result = tryCatchSync(fn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Sync error");
    }
  });
});

describe("Type Guards", () => {
  describe("isNonEmpty", () => {
    it("retorna true para array com elementos", () => {
      expect(isNonEmpty([1, 2, 3])).toBe(true);
      expect(isNonEmpty(["a"])).toBe(true);
    });

    it("retorna false para array vazio", () => {
      expect(isNonEmpty([])).toBe(false);
    });
  });

  describe("isDefined", () => {
    it("retorna true para valores definidos", () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined("")).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it("retorna false para null/undefined", () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("retorna true para strings não vazias", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString("  test  ")).toBe(true);
    });

    it("retorna false para strings vazias ou whitespace", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString("   ")).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });
});

describe("Error Message Extraction", () => {
  it("getErrorMessage extrai mensagem de Error", () => {
    expect(getErrorMessage(new Error("Test error"))).toBe("Test error");
  });

  it("getErrorMessage retorna string diretamente", () => {
    expect(getErrorMessage("String error")).toBe("String error");
  });

  it("getErrorMessage retorna fallback para unknown", () => {
    expect(getErrorMessage({ code: 500 })).toBe("Erro desconhecido");
    expect(getErrorMessage(null)).toBe("Erro desconhecido");
  });
});

describe("Error Code Extraction", () => {
  it("getErrorCode extrai statusCode de NetworkError", () => {
    const error = new NetworkError("Server error", 500);
    expect(getErrorCode(error)).toBe(500);
  });

  it("getErrorCode extrai status de objeto", () => {
    expect(getErrorCode({ status: 404 })).toBe(404);
  });

  it("getErrorCode retorna undefined para outros casos", () => {
    expect(getErrorCode(new Error("Generic"))).toBeUndefined();
    expect(getErrorCode("String")).toBeUndefined();
    expect(getErrorCode(null)).toBeUndefined();
  });
});

describe("Error Type Checkers", () => {
  it("isNetworkError identifica NetworkError", () => {
    expect(isNetworkError(new NetworkError("Test", 500))).toBe(true);
    expect(isNetworkError(new Error("Generic"))).toBe(false);
    expect(isNetworkError("String")).toBe(false);
  });

  it("isValidationError identifica ValidationError", () => {
    expect(isValidationError(new ValidationError("Invalid", "field"))).toBe(true);
    expect(isValidationError(new Error("Generic"))).toBe(false);
  });

  it("isNotFoundError identifica NotFoundError", () => {
    expect(isNotFoundError(new NotFoundError("Not found", "user", "1"))).toBe(true);
    expect(isNotFoundError(new Error("Generic"))).toBe(false);
  });
});

describe("Error Guards em Componentes", () => {
  it("renderiza erro com guard", () => {
    const TestComponent = ({ error }: { error: unknown }) => {
      if (isNetworkError(error)) {
        return <div role="alert">{error.statusCode}: {error.message}</div>;
      }
      return <div>Unknown error</div>;
    };

    const { rerender } = render(<TestComponent error={new NetworkError("Timeout", 503)} />);
    expect(screen.getByRole("alert")).toHaveTextContent("503: Timeout");

    rerender(<TestComponent error={new Error("Generic")} />);
    expect(screen.getByText("Unknown error")).toBeInTheDocument();
  });

  it("valida array não vazio com guard", () => {
    const TestList = ({ items }: { items: string[] }) => {
      if (!isNonEmpty(items)) {
        return <div>Empty list</div>;
      }
      return <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    };

    const { rerender } = render(<TestList items={[]} />);
    expect(screen.getByText("Empty list")).toBeInTheDocument();

    rerender(<TestList items={["a", "b"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
