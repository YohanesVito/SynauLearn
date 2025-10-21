import { Course } from "./supabase";

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Generate NFT metadata for a course badge
 */
export function generateBadgeMetadata(
  courseId: number,
  course: Course,
  imageIPFSUrl: string
): BadgeMetadata {
  return {
    name: `${course.title} Badge`,
    description: `Completion badge for ${course.title} course on SynauLearn. This NFT certifies that the holder has successfully completed all lessons and assessments in this course.`,
    image: imageIPFSUrl,
    attributes: [
      {
        trait_type: "Course",
        value: course.title,
      },
      {
        trait_type: "Course ID",
        value: courseId,
      },
      {
        trait_type: "Platform",
        value: "SynauLearn",
      },
      {
        trait_type: "Total Lessons",
        value: course.total_lessons,
      },
      {
        trait_type: "Emoji",
        value: course.emoji,
      },
      {
        trait_type: "Type",
        value: "Course Completion Badge",
      },
    ],
  };
}

/**
 * Generate metadata for all courses
 */
export function generateAllMetadata(
  courses: Array<{ courseId: number; course: Course; imageIPFSUrl: string }>
): Record<number, BadgeMetadata> {
  const metadata: Record<number, BadgeMetadata> = {};

  for (const { courseId, course, imageIPFSUrl } of courses) {
    metadata[courseId] = generateBadgeMetadata(courseId, course, imageIPFSUrl);
  }

  return metadata;
}

/**
 * Validate metadata structure
 */
export function validateMetadata(metadata: BadgeMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata.name || metadata.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!metadata.description || metadata.description.trim() === "") {
    errors.push("Description is required");
  }

  if (!metadata.image || !metadata.image.startsWith("ipfs://")) {
    errors.push("Image must be a valid IPFS URL");
  }

  if (!Array.isArray(metadata.attributes) || metadata.attributes.length === 0) {
    errors.push("Attributes array is required and must not be empty");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert metadata to JSON string with proper formatting
 */
export function metadataToJSON(metadata: BadgeMetadata): string {
  return JSON.stringify(metadata, null, 2);
}
