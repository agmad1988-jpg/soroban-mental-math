import tkinter as tk
from tkinter import messagebox
import random

class SorobanGame:
    def __init__(self):
        self.window = tk.Tk()
        self.window.title("سوروبان - الحساب الذهني 🧮")
        self.window.geometry("600x500")
        self.window.config(bg="#FFF7D6")
        
        self.score = 0
        self.level = 1
        self.streak = 0
        self.answers_given = 0
        
        self.setup_ui()
        self.new_question()
        
    def setup_ui(self):
        # العنوان
        title = tk.Label(self.window, text="🧮 سوروبان", font=("Arial", 28, "bold"), 
                        bg="#FFF7D6", fg="#7C6AE6")
        title.pack(pady=20)
        
        # الإحصائيات
        stats_frame = tk.Frame(self.window, bg="#F9FBFF")
        stats_frame.pack(fill="x", padx=20, pady=10)
        
        tk.Label(stats_frame, text=f"المستوى: {self.level}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
        tk.Label(stats_frame, text=f"النقاط: {self.score}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
        tk.Label(stats_frame, text=f"التتابع: {self.streak}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
        
        # السؤال
        self.question_label = tk.Label(self.window, text="", font=("Arial", 36, "bold"),
                                       bg="#FFF7D6", fg="#1F2A44")
        self.question_label.pack(pady=30)
        
        # أزرار الإجابات
        self.buttons_frame = tk.Frame(self.window, bg="#FFF7D6")
        self.buttons_frame.pack(pady=20)
        
        # زر البداية
        self.start_btn = tk.Button(self.window, text="ابدأ اللعبة", font=("Arial", 14, "bold"),
                                   bg="#7C6AE6", fg="white", padx=20, pady=10,
                                   command=self.play)
        self.start_btn.pack(pady=20)
        
    def new_question(self):
        if self.level == 1:
            a = random.randint(1, 9)
            b = random.randint(1, 9)
            op = random.choice(["+", "-"])
            if op == "+":
                self.answer = a + b
                self.q_text = f"{a} + {b}"
            else:
                x, y = max(a, b), min(a, b)
                self.answer = x - y
                self.q_text = f"{x} - {y}"
                
        elif self.level == 2:
            a = random.randint(1, 8)
            b = random.randint(1, 4)
            op = random.choice(["+", "-"])
            if op == "+":
                self.answer = a + b + 5
                self.q_text = f"{a} + {b} + 5"
            else:
                self.answer = a + 5 - b
                self.q_text = f"{a} + 5 - {b}"
                
        elif self.level == 3:
            a = random.randint(1, 9)
            b = random.randint(2, 8)
            op = random.choice(["+", "-"])
            if op == "+":
                self.answer = a + b + 10
                self.q_text = f"{a} + {b} + 10"
            else:
                self.answer = 10 + a - b
                self.q_text = f"10 + {a} - {b}"
                
        else:  # level 4
            op = random.choice(["+", "-", "×", "÷"])
            if op == "+":
                a = random.randint(5, 15)
                b = random.randint(3, 12)
                self.answer = a + b
                self.q_text = f"{a} + {b}"
            elif op == "-":
                a = random.randint(6, 18)
                b = random.randint(1, a - 1)
                self.answer = a - b
                self.q_text = f"{a} - {b}"
            elif op == "×":
                a = random.randint(2, 9)
                b = random.randint(2, 9)
                self.answer = a * b
                self.q_text = f"{a} × {b}"
            else:
                b = random.randint(2, 9)
                total = random.randint(2, 9) * b
                self.answer = total // b
                self.q_text = f"{total} ÷ {b}"
        
        self.question_label.config(text=f"{self.q_text} = ?")
        self.show_options()
        
    def show_options(self):
        for widget in self.buttons_frame.winfo_children():
            widget.destroy()
            
        options = [self.answer]
        while len(options) < 4:
            wrong = self.answer + random.randint(-15, 15)
            if wrong not in options and wrong >= 0:
                options.append(wrong)
        
        random.shuffle(options)
        
        for opt in options:
            btn = tk.Button(self.buttons_frame, text=str(opt), font=("Arial", 16, "bold"),
                           bg="#EAFDF7", fg="#1F2A44", padx=20, pady=10, width=8,
                           command=lambda x=opt: self.check_answer(x))
            btn.pack(side="left", padx=5)
    
    def check_answer(self, choice):
        if choice == self.answer:
            self.score += 10
            self.streak += 1
            messagebox.showinfo("صحيح! ✅", f"إجابة صحيحة!\nالنقاط: {self.score}")
        else:
            self.streak = 0
            messagebox.showerror("خطأ! ❌", f"الإجابة الصحيحة: {self.answer}")
        
        self.answers_given += 1
        
        # الانتقال للمستوى التالي بعد 3 إجابات صحيحة متتالية
        if self.streak >= 3 and self.level < 4:
            self.level += 1
            self.streak = 0
            messagebox.showinfo("تهانينا!", f"انتقلت للمستوى {self.level}!")
        elif self.streak >= 3 and self.level == 4:
            messagebox.showinfo("انتهيت!", f"أكملت جميع المستويات!\nالنقاط النهائية: {self.score}")
            self.window.quit()
        
        self.update_stats()
        self.new_question()
    
    def update_stats(self):
        # تحديث الإحصائيات
        stats_frame = self.window.winfo_children()[1]
        
        for widget in stats_frame.winfo_children():
            widget.destroy()
        
        tk.Label(stats_frame, text=f"المستوى: {self.level}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
        tk.Label(stats_frame, text=f"النقاط: {self.score}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
        tk.Label(stats_frame, text=f"التتابع: {self.streak}", font=("Arial", 12, "bold"), 
                bg="#F9FBFF").pack(side="left", padx=10)
    
    def play(self):
        self.start_btn.pack_forget()
        self.new_question()
    
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    game = SorobanGame()
    game.run()
