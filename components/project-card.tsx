"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  /** Título do projeto */
  title: string;
  /** Descrição do projeto */
  description: string;
  /** URL da imagem */
  imageUrl?: string;
  /** Tags/tecnologias */
  tags: readonly string[];
  /** URL do projeto */
  href?: string;
  /** Handler de clique */
  onClick?: () => void;
}

/**
 * Card de projeto com animação e acessibilidade
 * @example
 * <ProjectCard
 *   title="Meu Projeto"
 *   description="Descrição detalhada"
 *   tags={["React", "TypeScript"]}
 *   href="https://exemplo.com"
 * />
 */
export function ProjectCard({
  title,
  description,
  imageUrl,
  tags,
  href,
  onClick,
}: ProjectCardProps): React.JSX.Element {
  const handleClick = (): void => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      data-testid="project-card"
      aria-label={`Projeto: ${title}`}
    >
      {imageUrl && (
        <div className="mb-4 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt={`Screenshot do projeto ${title}`}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold" data-testid="project-title">
        {title}
      </h3>

      <p className="mb-4 text-sm text-muted-foreground" data-testid="project-description">
        {description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2" role="list" aria-label="Tecnologias utilizadas">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            role="listitem"
            data-testid={`project-tag-${tag.toLowerCase()}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {(href || onClick) && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          aria-label={`Ver detalhes do projeto ${title}`}
          data-testid="project-view-button"
        >
          Ver projeto
        </Button>
      )}
    </motion.article>
  );
}
