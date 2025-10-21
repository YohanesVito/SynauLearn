/**
 * Setup IPFS - One-time script to upload all badge metadata to IPFS
 *
 * This script:
 * 1. Fetches all courses from Supabase
 * 2. Generates badge images for each course
 * 3. Uploads images to IPFS
 * 4. Generates metadata JSON files
 * 5. Uploads metadata folder to IPFS
 * 6. Returns the folder CID to set as baseURI
 *
 * Usage: npx tsx scripts/setupIPFS.ts
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import { API } from '../lib/api';
import { uploadFile, uploadFolder, getIPFSGatewayUrl } from '../lib/ipfs';
import { generateBadgeMetadata, metadataToJSON } from '../lib/metadata';
import { generateBadgeFile } from '../lib/imageGenerator';
import { getCourseNumber, getAllMappedUUIDs, getMappingStats } from '../lib/courseMapping';

async function main() {
  console.log('🚀 Starting IPFS Setup...\n');

  // Step 1: Check course mappings
  console.log('📊 Checking course mappings...');
  const stats = getMappingStats();
  console.log(`   ✅ ${stats.totalMapped} courses mapped`);
  console.log(`   📈 Highest course number: ${stats.maxNumber}`);
  console.log(`   🆕 Next available: ${stats.nextAvailable}\n`);

  if (stats.totalMapped === 0) {
    console.error('❌ No courses mapped! Please add course mappings to lib/courseMapping.ts first.');
    console.log('\nExample:');
    console.log("  courseIdToNumber: {");
    console.log("    'your-course-uuid-here': 1,");
    console.log("  }");
    process.exit(1);
  }

  // Step 2: Fetch courses from database
  console.log('📚 Fetching courses from database...');
  const allCourses = await API.getCourses();
  console.log(`   Found ${allCourses.length} total courses in database\n`);

  // Filter to only mapped courses
  const mappedUUIDs = getAllMappedUUIDs();
  const coursesToProcess = allCourses.filter(course => mappedUUIDs.includes(course.id));

  console.log(`📦 Processing ${coursesToProcess.length} mapped courses...\n`);

  if (coursesToProcess.length === 0) {
    console.error('❌ No courses found that match the mapping!');
    console.log('\nMapped UUIDs:', mappedUUIDs);
    console.log('Database course IDs:', allCourses.map(c => c.id));
    process.exit(1);
  }

  // Step 3: Upload images to IPFS
  console.log('🎨 Generating and uploading badge images...\n');
  const imageUploads: Record<number, string> = {};

  for (const course of coursesToProcess) {
    const courseNum = getCourseNumber(course.id);
    if (!courseNum) continue;

    console.log(`   Processing Course ${courseNum}: ${course.title}`);

    // Generate SVG badge image
    const imageFile = generateBadgeFile({
      emoji: course.emoji,
      courseName: course.title,
      courseId: courseNum,
    });

    // Upload to IPFS
    const result = await uploadFile(imageFile, `badge-${courseNum}.svg`);

    if (result.success && result.ipfsUrl) {
      imageUploads[courseNum] = result.ipfsUrl;
      console.log(`   ✅ Image uploaded: ${result.ipfsUrl}`);
      console.log(`      Gateway: ${getIPFSGatewayUrl(result.ipfsUrl)}`);
    } else {
      console.error(`   ❌ Failed to upload image: ${result.error}`);
    }
  }

  console.log(`\n✅ Uploaded ${Object.keys(imageUploads).length} images\n`);

  // Step 4: Generate metadata files
  console.log('📝 Generating metadata files...\n');
  const metadataFiles: { name: string; content: string }[] = [];

  for (const course of coursesToProcess) {
    const courseNum = getCourseNumber(course.id);
    if (!courseNum || !imageUploads[courseNum]) continue;

    const metadata = generateBadgeMetadata(
      courseNum,
      course,
      imageUploads[courseNum]
    );

    const json = metadataToJSON(metadata);
    metadataFiles.push({
      name: `${courseNum}.json`,
      content: json,
    });

    console.log(`   ✅ Generated metadata for Course ${courseNum}: ${course.title}`);
  }

  console.log(`\n✅ Generated ${metadataFiles.length} metadata files\n`);

  // Step 5: Upload metadata folder to IPFS
  console.log('📁 Uploading metadata folder to IPFS...\n');
  const folderResult = await uploadFolder(metadataFiles);

  if (!folderResult.success || !folderResult.ipfsUrl) {
    console.error('❌ Failed to upload metadata folder:', folderResult.error);
    process.exit(1);
  }

  // Step 6: Display results
  console.log('\n' + '='.repeat(80));
  console.log('🎉 IPFS SETUP COMPLETE!');
  console.log('='.repeat(80) + '\n');

  console.log('📊 Summary:');
  console.log(`   • Courses processed: ${coursesToProcess.length}`);
  console.log(`   • Images uploaded: ${Object.keys(imageUploads).length}`);
  console.log(`   • Metadata files: ${metadataFiles.length}\n`);

  console.log('📁 IPFS Folder Details:');
  console.log(`   • Folder CID: ${folderResult.cid}`);
  console.log(`   • IPFS URL: ${folderResult.ipfsUrl}`);
  console.log(`   • Gateway URL: ${getIPFSGatewayUrl(folderResult.ipfsUrl!)}\n`);

  console.log('🔗 Contract BaseURI:');
  console.log(`   ${folderResult.ipfsUrl}\n`);

  console.log('📋 Next Steps:');
  console.log('   1. Copy the baseURI above');
  console.log('   2. Run: npx tsx scripts/setBaseURI.ts "' + folderResult.ipfsUrl + '"');
  console.log('   3. Or manually call setBaseURI on your contract\n');

  console.log('🔍 Verify Upload:');
  console.log('   Visit: ' + getIPFSGatewayUrl(folderResult.ipfsUrl!) + '\n');

  console.log('📄 Individual Metadata Files:');
  for (let i = 0; i < Math.min(3, metadataFiles.length); i++) {
    const file = metadataFiles[i];
    console.log(`   • ${folderResult.ipfsUrl}${file.name}`);
  }
  if (metadataFiles.length > 3) {
    console.log(`   ... and ${metadataFiles.length - 3} more\n`);
  }

  console.log('='.repeat(80) + '\n');
}

main()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
