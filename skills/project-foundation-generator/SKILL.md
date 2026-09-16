---
name: project-foundation-generator
description: Build a project-level "Project Foundation" Figma file that references the organization's Core Design System — imports every published 🟩 component with all variants, mirrors token collections (live-aliased where Core has published, manual snapshot where it hasn't), rebinds every component instance to the project's local tokens, and sets up Dark Mode. Use when a designer asks to create/scaffold a new project's design system based on the org's Core DS. Trigger this whenever the user says things like "set up a project foundation", "scaffold our design system from Core", "create a new project Figma file based on Core Design System", or pastes a blank/empty Figma file link and asks to build out tokens/components for a new project.
---

# Project Foundation Generator

ทำตามลำดับนี้เท่านั้น ห้ามข้ามขั้นตอน ห้ามรวมหลายขั้นตอนเข้าด้วยกันในคำสั่งเดียว

## วิธีใช้งาน (สำหรับคนที่ได้ไฟล์นี้มา)

พิมพ์กับ Claude (ต้องเปิดใช้ Figma MCP / use_figma tool อยู่):

```
/project-foundation-generator

ไฟล์ปลายทางของโปรเจกต์เรา: [ใส่ลิงก์ไฟล์ Figma เปล่าที่เตรียมไว้]
```

สิ่งเดียวที่ต้องเตรียม คือลิงก์ไฟล์ Figma เปล่าของโปรเจกต์ใหม่ ที่เหลือ Claude จัดการให้ทั้งหมดตามขั้นตอนด้านล่าง — ไฟล์ Core Design System และกฎการดึงข้อมูลถูก fix ไว้แล้ว ไม่ต้องตอบคำถามเพิ่ม ยกเว้นตอนที่ระบบหยุดถาม (Checkpoint) ซึ่งจะมี 4 จุดตลอดกระบวนการ

Skill นี้รันครั้งเดียวจบ ใช้ตอนเริ่มโปรเจกต์ใหม่เท่านั้น ถ้าต้องการเช็คว่า Core Design System อัปเดตอะไรใหม่หลังจากสร้าง Project Foundation ไปแล้ว ให้ใช้ skill คู่กันชื่อ `core-update-check` แทน (รันซ้ำได้เรื่อยๆ)

## กฎตายตัว (fix ไว้แล้ว ห้ามถามผู้ใช้ซ้ำ)
- **Core Design System ใช้ไฟล์นี้เสมอ**, ไม่ต้องถามยืนยัน:
  `https://www.figma.com/design/ON8Azjo7wIi3P2oxnxKiBb/⭐️-Core-Design-Library`
- **ขอบเขต component: เอาทุกตัวที่มี marker 🟩 อยู่ใต้ "CORE COMPONENTS" เสมอ**
  ไม่ต้องถามว่าจะเอาทั้งหมดหรือบางส่วน
- **Token/component ที่ Core ยังไม่ publish: เอามาด้วยเสมอแบบ manual copy**
  (อ่านค่าตรงจากไฟล์ Core, ห้าม hardcode เดา, ใส่ description กำกับชัดเจนว่า
  "manual snapshot ไม่ live-link") ไม่ต้องถามผู้ใช้

## Phase 0 — Discovery (read-only เท่านั้น ห้ามเขียนอะไรลง Figma ในเฟสนี้)
1. รับลิงก์ไฟล์ปลายทางของโปรเจกต์จากผู้ใช้ (ไม่ต้องขอลิงก์ Core DS เพราะ fix
   ไว้แล้วด้านบน)
2. เปิดไฟล์ Core DS (URL fixed ด้านบน) ด้วย use_figma แล้ว inspect
   โครงสร้างหน้าจริงด้วย `figma.root.children.map(p => ({id, name}))` —
   **ห้ามเชื่อผลจาก get_metadata แบบไม่ใส่ nodeId เพียงอย่างเดียว เพราะมัน
   รายงานหน้าไม่ครบ**
3. หา section "CORE COMPONENTS" แล้วดึงรายชื่อหน้าที่มี marker 🟩 ทั้งหมด
   (ตามกฎตายตัวด้านบน — ไม่ต้องถามขอบเขต)
4. สรุปรายการ component ที่เจอ + จำนวน variant ต่อตัว ให้ผู้ใช้ดู แล้วเดินหน้า
   ต่อ Phase 1 ได้เลย

## Phase 1 — Page Structure
1. สร้างหน้า Figma ตามที่ Core จัดกลุ่มไว้จริง (ดูว่า Core รวมหลาย component
   ไว้หน้าเดียวหรือแยกหน้า แล้วทำตามนั้น)
2. ชื่อหน้าให้ตรงกับชื่อหน้าใน Core เป๊ะ (ไม่ใช่ชื่อ component set ข้างใน)
3. เรียง order หน้าให้ตรงกับ Core
4. บอกผู้ใช้ว่า Claude สร้างเฉพาะหน้าตามลำดับให้ ส่วนการจัดกลุ่มด้วย Figma
   Page Section (divider 🔹 / ↳) ต้องให้ผู้ใช้ทำเองใน UI — ไม่ใช่ checkpoint
   ที่ต้องรอ แค่แจ้งให้ทราบ

## Phase 2 — Token Mirror
1. อ่าน variable collection ทั้งหมดจากไฟล์ Core โดยตรง (ไม่ใช้
   search_design_system เป็นแหล่งเดียว เพราะเป็นแค่ search index ไม่ใช่
   แผนผังไฟล์จริง) — ระหว่างอ่าน ให้เช็คด้วยว่าแต่ละ collection มี mode
   "Dark" อยู่หรือไม่ นอกเหนือจาก mode default/Light
2. ต่อ collection: ทดสอบ importVariableByKeyAsync ทีละตัว
   - import สำเร็จ → สร้าง local variable ที่ alias กลับไป Core (live-link)
     — ค่าทุก mode รวม Dark จะตามมาอัตโนมัติเพราะเป็น alias ตรง ไม่ต้อง
     ทำอะไรเพิ่ม
   - import ไม่สำเร็จ ("not found") → อ่านค่าตรงจากไฟล์ Core แล้ว copy เป็น
     manual value **ให้ครบทุก mode ที่ Core มี (รวม Dark ถ้ามี
     ไม่ใช่แค่ mode default)** ใส่ description กำกับชัดเจนว่าไม่ live-link แล้วเดินหน้า
     ต่อทันที (ตามกฎตายตัวด้านบน — **ไม่ต้องถามผู้ใช้แล้ว**)
3. ถ้ามี primitive → semantic layering (เช่น _Color Primitive → Color Theme)
   ให้สร้าง local primitive layer ในโปรเจกต์ แล้วให้ semantic layer อ้างอิง
   local primitive ของโปรเจกต์เอง (ไม่ alias ตรงไป Core ในชั้น semantic)
   — **แต่ local primitive เองต้อง live-link กับ Core ให้มากที่สุดเท่าที่
   publish แล้ว** ใช้ manual copy เฉพาะตัวที่ยืนยันว่า Core ไม่ publish จริง

## Phase 3 — Component Import (ทำทีละ component, validate ก่อนตัวถัดไป)
1. เริ่มจาก component ที่เล็กที่สุดก่อนเป็น pilot
2. import ทั้ง component set → instance ทุก variant (ห้าม detach) → wrap แต่ละ
   variant เป็น local component → combineAsVariants กลับเป็น local set ที่
   ตำแหน่ง/ชื่อ variant ตรงกับ Core
3. Screenshot ตรวจสอบ
4. **หยุดถามผู้ใช้ (Checkpoint #1)** ว่า pattern โอเคไหม ก่อนขยายไปทำ
   component ที่เหลือทั้งหมดรวดเดียว

## Phase 4 — Rebind (สำคัญที่สุด ห้ามข้าม)
1. เลือก component ที่ทำ pilot ไว้ใน Phase 3
2. ไล่ rebind ทุก property (fill/stroke/padding/radius/font) ของทุก instance
   ในนั้น จากตัวแปร Core ไปเป็นตัวแปร local ของโปรเจกต์
3. ทดสอบจริง: เปลี่ยนค่า primitive token ใน local ดูว่า cascade เข้า
   component จริงไหม (screenshot ก่อน/หลัง) แล้ว revert กลับ
4. **หยุดถามผู้ใช้ (Checkpoint #2)** แสดงผลทดสอบ แล้วขอทำ rebind กับ
   component ที่เหลือทั้งหมด

## Phase 5 — Dark Mode (ทำเฉพาะถ้า Core มี pattern นี้)

ค่าตัวแปรของ mode "Dark" ถูก mirror ไว้แล้วตั้งแต่ Phase 2 — เฟสนี้แค่ apply
mode ให้ section ใหม่ ไม่ต้อง copy ค่าเพิ่ม

1. เช็คว่าแต่ละหน้าของ Core มี SECTION ชื่อ "Dark Mode" หรือไม่
2. ถ้ามี → **หยุดถามผู้ใช้ (Checkpoint #3)** ว่าจะทำ Dark Mode ครบทุกหน้า
   ไหม (จะเพิ่ม instance เป็น 2 เท่าทั้งไฟล์)
3. ถ้าตกลง: สร้าง SECTION ชื่อ "Dark Mode" ต่อหน้า, clone เนื้อหา light mode
   ทั้งหมดใส่ข้างใน, bind พื้นหลัง section เข้ากับ Surface/Neutral/Neutral
   Primary, ใช้ setExplicitVariableModeForCollection บังคับ mode เป็น Dark

## กฎทั่วไปสำหรับทุกเฟส
- ถ้าเจอสถานะไฟล์ที่ไม่คาดคิด (หน้าหาย, ข้อมูลที่ไม่ได้สร้างเอง) →
  **หยุดถามผู้ใช้ (Checkpoint #4)** ก่อนเสมอ ห้ามลบ/เขียนทับ/สร้างทดแทนเอง
- Component/variable ที่ import แล้วขึ้น "not found" ไม่ใช่บั๊ก — Core
  ไม่ publish ตัวนั้น ให้อ่านค่าตรงจากไฟล์ Core แทน (ตามกฎตายตัว ไม่ต้องถาม)
- ไม่มี Plugin API สำหรับ reorder variable collection หรือ publish สิ่งที่
  ยังไม่ publish — ถ้าผู้ใช้ต้องการสิ่งนี้ ให้บอกว่าต้องทำผ่าน Figma UI เอง
- สคริปต์ที่ error กลางทางอาจไม่ rollback เต็มรูปแบบ — เช็คสถานะไฟล์จริง
  หลัง error ทุกครั้ง ห้ามสมมติว่า atomic 100%

## เอกสารอ้างอิงเพิ่มเติม (ไม่บังคับอ่าน)

หน้า Notion เต็มที่มีตัวอย่างการใช้งานจริง (scenario), ตารางอธิบาย checkpoint, และเหตุผล (Why) ของแต่ละ Phase:
- Project Foundation Generator V.2: https://app.notion.com/p/3b67817ccced80b4a575e819a11a8fb8
- Skill คู่กัน (เช็คอัปเดตจาก Core หลังสร้างเสร็จแล้ว) — core-update-check: https://app.notion.com/p/3b67817ccced80109495cffff06ef79c
