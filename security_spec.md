# Security Specification: Japan Localog

## Data Invariants
1. A `Post` must have an `authorId` matching the creator's UID.
2. A `Recommendation` must have a `likesCount` which is incremented/decremented alongside `userLikes` document creation/deletion.
3. Only the user who created a `userLike` can delete it.
4. Only users whose UID exists in the `admins` collection can write to `posts` and `recommendations` (except for `likesCount` updates).

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a post with `authorId` of another user.
2. **Unauthorized Post Creation**: A non-admin user attempting to create a post.
3. **Unauthorized Post Modification**: A non-admin user attempting to update a post's title.
4. **Invalid Post Schema**: Creating a post missing the `region` field.
5. **Junk ID Poisoning**: Creating a post with a 2KB string as the document ID.
6. **Likes Manipulation**: A user attempting to update `likesCount` on a recommendation without creating a `userLikes` document.
7. **Double Like**: A user attempting to create two `userLikes` for the same recommendation (prevented by doc ID being the userId).
8. **Impersonated Like**: User A creating a `userLike` document with `userId: UserB`.
9. **PII Leak**: (Not applicable here as we don't store PII yet, but good to keep in mind).
10. **Terminal State Bypass**: (No terminal status yet).
11. **Shadow Field Injection**: Adding an `isAdmin: true` field to a post document.
12. **Future Timestamp**: Setting `createdAt` to a time in the future.

## Test Runner (Draft)
Verification will be done by ensuring rules mirror these constraints.
